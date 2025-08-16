import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import type { Shape } from "./Game";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data?.messages ?? []; // ✅ default to []

    return messages
      .map((x: { message: string }) => {
        try {
          const data = JSON.parse(x.message);
          if (data?.shape?.type) {
            return data.shape as Shape;
          }
        } catch {
          console.warn("Invalid DB message:", x.message);
        }
        return null;
      })
      .filter((s): s is Shape => s !== null);
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
    return []; // ✅ safe fallback
  }
}
