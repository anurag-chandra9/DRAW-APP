//1.30hrs

import express from "express";
import jwt from "jsonwebtoken"; 
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/src/types";

 const app = express();
 app.listen(3001);

 app.post("/signup", async function (req, res){
    const data=  CreateUserSchema .safeParse(req.body);
    if(!data.success){
        return res.status(400).json({
            error: data.error.issues
        });
    }
   //db call to create a user
    res.json({
          userId: 1
     });



 })
 app.post("/signin", async function (req, res){
     const data=  SigninSchema.safeParse(req.body);
    if(!data.success){
        return res.status(400).json({
            error: data.error.issues
        });
    }
   
    const userId=1;
   const token= jwt.sign({
        userId
    }, JWT_SECRET);
    res.json({
        token
    })
})
 app.post("/room",  middleware, async function (req, res){
     const data= CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        return res.status(400).json({
            error: data.error.issues
        });
    }
   
       //db call to create a room
       res.json({
        roomId:123
       })

       


 })