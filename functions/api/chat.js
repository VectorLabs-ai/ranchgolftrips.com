import { TripChatRoom } from "../trip-chat-room.js";

export { TripChatRoom };

export async function onRequest(context) {
  const ns = context.env.CHAT_ROOM;
  if (!ns) {
    return new Response("CHAT_ROOM binding missing — check wrangler.toml and Pages Durable Object binding.", {
      status: 500,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
    });
  }
  const id = ns.idFromName("mountain-man-2026");
  const stub = ns.get(id);
  return stub.fetch(context.request);
}
