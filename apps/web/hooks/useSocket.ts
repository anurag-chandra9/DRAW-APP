import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMWMwY2EzOS0wNzRlLTQ3ODAtYmYyMS02NTM4NDI5YzJmYTAiLCJpYXQiOjE3NTQ2NzMwNTJ9.D4yvm1suzgDVae2rlgOfOYCi-G8uBsXNnuo_5RJfRIM`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}