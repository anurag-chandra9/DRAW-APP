import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxN2RjMjk4YS01YTg0LTRiY2YtOTM5Ny04ODc0MDNhNWIzNmQiLCJpYXQiOjE3NTUxODExOTR9.4FwRRRspQtihupGvYJWhgjzQr97lJW83GKWD8H_EigI`);
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