"use client"
import React, { useEffect, useRef, useState } from "react";
import { initDraw } from "@/app/draw";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
export function RoomCanvas({roomId}: {roomId: string}){
    
    const [socket,setSocket]=useState<WebSocket | null>(null);
    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxN2RjMjk4YS01YTg0LTRiY2YtOTM5Ny04ODc0MDNhNWIzNmQiLCJpYXQiOjE3NTUxODExOTR9.4FwRRRspQtihupGvYJWhgjzQr97lJW83GKWD8H_EigI"
}`)
        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        }
    },[])

  if(!socket){
    return <div>
        connecting to server...
    </div>
  }
   return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
      <button className="bg-white text-black">Rect</button>
      <button className="bg-white text-black">Circle</button>
    </div>
);
}