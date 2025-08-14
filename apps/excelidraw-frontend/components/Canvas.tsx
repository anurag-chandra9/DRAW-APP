import { useEffect, useRef } from "react";
import { initDraw } from "@/app/draw";
import { Socket } from "dgram";

export function Canvas({roomId}: {roomId: string}) {
    const canvasRef= useRef<HTMLCanvasElement>(null);
      useEffect(()=>{
    if(canvasRef.current){
         initDraw(canvasRef.current,roomId,socket);


    }
  },[canvasRef]);
  return <div>
    <canvas ref={canvasRef} width={"1200"} height={"1180"}></canvas>
  </div>
}