export async function onRequest(context) {
  const ns = context.env.CHAT_ROOM;
  if (!ns) {
    return new Response(
      "CHAT_ROOM binding missing — deploy workers/trip-chat-do then bind script_name ranchgolftrips-trip-chat (see DEPLOYMENT.md).",
      {
        status: 500,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
      }
    );
  }
  const id = ns.idFromName("mountain-man-2026");
  const stub = ns.get(id);
  return stub.fetch(context.request);
}
