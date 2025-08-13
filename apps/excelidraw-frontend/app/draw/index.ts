export function initDraw(canvas: HTMLCanvasElement){
     const ctx= canvas.getContext("2d");
      if(!ctx){
        return;
      }

      let clicked= false;
      let startX=0;
      let startY=0;

      canvas.addEventListener("mousedown",(e)=>{
        clicked= true;
        startX= e.clientX;
        startY= e.clientY;
         ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      })
      canvas.addEventListener("mouseup",(e)=>{
        clicked= false;
        console.log(e.clientX, e.clientY);
      })
      canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            const width= e.clientX - startX;
            const height= e.clientY - startY;
            ctx.clearRect(0, 0, width, height);
            ctx.strokeRect(startX, startY, width, height);
        }
      })
}