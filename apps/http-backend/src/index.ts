import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import {middleware} from "./middleware.js";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/src/types";
import { Prismaclient } from "@repo/db/client";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await Prismaclient.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // TODO: Compare the hashed pws here
    const user = await Prismaclient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
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

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await Prismaclient.chat.findMany({
      where: { roomId },
      orderBy: { id: "asc" },
      take: 1000
    });
    res.json({ messages });   // ✅ return messages, not shapes
  } catch (e) {
    console.error("Error fetching chats:", e);
    res.json({ messages: [] });
  }
});


app.listen(3001);