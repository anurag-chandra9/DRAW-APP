"use client"
import { useEffect, useRef } from "react";
import { start } from "repl";
import { initDraw } from "@/app/draw";

export default function Canvas(){

  const canvasRef= useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(canvasRef.current){
         initDraw(canvasRef.current);
         
     
    }
  },[]);
   return (
    <div>
      <canvas
        ref={canvasRef}
       width={"1200"}
       height={"1180"}
        style={{ background: "white", border: "1px solid black" }}
      />
    </div>
);
}
