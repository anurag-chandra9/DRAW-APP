"use client";
//2.14min
import {  useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <div>
        <input value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} type="text" placeholder="Enter Room ID" ></input>
        <button onClick={() => router.push(`/room/${roomId}`)}>Join Room </button>
      </div>
    </div>
  );
}