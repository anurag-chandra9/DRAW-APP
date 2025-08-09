import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config";
import {Prismaclient} from "@repo/db/client";


const wss = new WebSocketServer({ port: 8080 });
   interface User {
    ws: WebSocket,
    rooms: number[],
    userId: string
   }

//    const users = [{
//     userId :1,
//     rooms:["rooms1", "rooms2"],
//     ws: WebSocket},
//     {
//         userId:2,
//         rooms:["rooms1"],
//         ws: WebSocket
//     },
//     {
//         userId: 3,
//         rooms: [],
//         ws: WebSocket
//     }
// ]
  const users: User[] = [];



function checkUser(token:string): string | null {
   try {
     const decoded = jwt.verify(token,JWT_SECRET);
    if (typeof decoded== "string"){
        return null;
    }
    if( !decoded || !decoded.userId){
        return null;
    }
    return decoded.userId;
   } catch (error) {
       return null;
   }
   return null;
}

wss.on ('connection', function connection(ws, request){

   const url= request.url; 
   if (!url){
    return;
   }

   const  queryParams = new URLSearchParams(url.split('?')[1]);
   const token = queryParams.get('token')||"";
   const userId = checkUser(token);
   if(userId== null){
    ws.close();
    return null;
   }

    users.push({
        userId,
        rooms: [],
        ws
    });

    
    ws.on('message', async function message(data){
        try {
            const parsedData = JSON.parse(data.toString());

            if(parsedData.type === "join_room"){
                const roomId = parseInt(parsedData.roomId);
                const user = users.find(x=> x.ws ===ws);
                if(user && !user.rooms.includes(roomId)){
                    user.rooms.push(roomId);
                }
                ws.send(JSON.stringify({
                    type: "joined_room",
                    roomId: roomId
                }));
            }
            
            if (parsedData.type === "leave_room"){
                const roomId = parseInt(parsedData.roomId);
                const user = users.find(x=> x.ws ===ws);
                if(!user){
                    return;
                }
                user.rooms = user.rooms.filter(x=> x !== roomId);
                ws.send(JSON.stringify({
                    type: "left_room",
                    roomId: roomId
                }));
            }

            if (parsedData.type === "chat"){
                const roomId = parseInt(parsedData.roomId);
                const message = parsedData.message;
                
                try {
                    await Prismaclient.chat.create({
                        data:{
                            roomId: Number(roomId),
                            message: message,
                            userId: userId
                        }
                    });

                    users.forEach(user =>{
                        if(user.rooms.includes(roomId)){
                            user.ws.send(JSON.stringify({
                                type: "chat",
                                roomId: roomId,
                                message: message,
                                userId: userId
                            }));
                        }
                    });
                } catch (error) {
                    console.error('Database error:', error);
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Failed to save message"
                    }));
                }
            }
        } catch (error) {
            console.error('JSON Parse error:', error);
            ws.send(JSON.stringify({
                type: "error",
                message: "Invalid JSON format"
            }));
        }
    });
});

console.log("WebSocket server is running on ws://localhost:8080");