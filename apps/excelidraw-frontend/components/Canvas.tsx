import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Canvas as background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-0"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      {/* Toolbar on top */}
      <Topbar
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
      />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div
      className="
        fixed top-5 left-5 z-10
        flex gap-2
        bg-white/90 backdrop-blur-md
        shadow-lg rounded-xl px-3 py-2
      "
    >
      <IconButton
        onClick={() => setSelectedTool("pencil")}
        activated={selectedTool === "pencil"}
        icon={<Pencil />}
      />
      <IconButton
        onClick={() => setSelectedTool("rect")}
        activated={selectedTool === "rect"}
        icon={<RectangleHorizontalIcon />}
      />
      <IconButton
        onClick={() => setSelectedTool("circle")}
        activated={selectedTool === "circle"}
        icon={<Circle />}
      />
    </div>
  );
}
