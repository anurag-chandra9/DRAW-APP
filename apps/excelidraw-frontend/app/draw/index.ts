import axios from "axios";
import { HTTP_BACKEND } from "@/config";
type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  type: "circle";
  centreX: number;
  centreY: number;
  radius: number;
}

export async function initDraw(canvas: HTMLCanvasElement,roomId:string,socket: WebSocket   ) {
  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }
  socket.onmessage=(event)=>{
    const message= JSON.parse(event.data);
    if(message.type ==="chat"){
        const parsedShape= JSON.parse(message.message);
        existingShapes.push(parsedShape);
        clearCanvas(existingShapes, canvas, ctx);
    }

  }
  clearCanvas(existingShapes, canvas, ctx);
  
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const rect = canvas.getBoundingClientRect();
    const width = (e.clientX - rect.left) - startX;
    const height = (e.clientY - rect.top) - startY;
    const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height
    }

    existingShapes.push(shape);
    
    socket.send(JSON.stringify({
        shape
    }));
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const rect = canvas.getBoundingClientRect();
      const width = (e.clientX - rect.left) - startX;
      const height = (e.clientY - rect.top) - startY;
      
      
      clearCanvas(existingShapes, canvas, ctx);
      
    
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
 
  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });
return shapes;
}