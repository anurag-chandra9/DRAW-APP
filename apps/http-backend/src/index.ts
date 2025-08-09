//1.30hrs
import express from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/src/types";
import { Prismaclient } from "@repo/db/client";
 const app = express();
 app.listen(3001);
 app.use(express.json());

 app.post("/signup", async function (req, res){
    const parsedData =  CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({
            error: parsedData.error.issues
        });
    }
    try{


 const user = await Prismaclient.user.create({
        data:{
            email: parsedData.data.username,
            password: parsedData.data.password,
            name: parsedData.data.name,
            photo: ""
        }
    });
   //db call to create a user
    res.json({
          userId: user.id
     });
    }catch(err){
        res.status(411).json({
            error: "User already exists"
        });
    }
});
 app.post("/signin", async function (req, res){
     const parsedData =  SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({
            error: parsedData.error.issues
        });
    }
    const user = await Prismaclient.user.findUnique({
        where:{
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });
 
     if (!user){
        res.status(401).json({
            error: "Not authorized"
        });
     }


   const token= jwt.sign({
        userId: user?.id
    }, JWT_SECRET);
    res.json({
        token
    })
})
 app.post("/room", middleware, async function (req, res){
     const parsedData = CreateRoomSchema.safeParse(req.body);
     if(!parsedData.success){
         res.status(400).json({
            error: parsedData.error.issues
        });
        return;
     }
     
     const userId = req.userId;
     if (!userId) {
         res.status(401).json({
             error: "User not authenticated"
         });
         return;
     }

     try {
         const room = await Prismaclient.room.create({
             data: {
                 slug: parsedData.data.name,
                 adminId: userId
             }
         });
         
         res.json({
             roomId: room.id
         });
     } catch (err) {
         res.status(500).json({
             error: "Failed to create room"
         });
     }
 });

app.get("/chats/:roomId", async function (req, res) {
    try {
        const roomId = Number(req.params.roomId);
        
        if (isNaN(roomId)) {
            return res.status(400).json({
                error: "Invalid room ID"
            });
        }

        const messages = await Prismaclient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.json({
            success: true,
            messages: messages
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch messages"
        });
    }
});