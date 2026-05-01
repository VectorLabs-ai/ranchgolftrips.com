export { TripChatRoom } from "./trip-chat-room.js";

export default {
  /**
   * Direct hits to this Worker are not used; Pages proxies WebSockets to the DO.
   */
  fetch() {
    return new Response("Trip chat WebSocket is served from the ranch site at /api/chat.", {
      status: 404,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
    });
  },
};
