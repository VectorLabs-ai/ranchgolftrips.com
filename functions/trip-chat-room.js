/**
 * Durable Object: single trip chat room + persisted scrollback.
 */
export class TripChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response(
        "Trip chat uses a WebSocket. Open ranchgolftrips.com in a modern browser.",
        {
          status: 400,
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
        }
      );
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server);

    const log = (await this.state.storage.get("log")) || [];
    try {
      server.send(JSON.stringify({ type: "history", messages: log }));
    } catch (_) {}

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    const raw = typeof message === "string" ? message : new TextDecoder().decode(message);
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    if (data.type !== "chat" || typeof data.text !== "string") return;

    const nick = String(data.nick || "anon")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .slice(0, 40);
    const text = String(data.text)
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, 500);
    if (!text) return;

    const entry = { nick, text, ts: Date.now() };
    let log = (await this.state.storage.get("log")) || [];
    log.push(entry);
    if (log.length > 300) log = log.slice(-300);
    await this.state.storage.put("log", log);

    const outbound = JSON.stringify({ type: "chat", ...entry });
    for (const sock of this.state.getWebSockets()) {
      try {
        sock.send(outbound);
      } catch (_) {}
    }
  }
}
