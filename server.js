const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on("connection", (ws) => {
  console.log("Новый клиент подключился");

  ws.on("message", (message) => {
    console.log("Сообщение:", message.toString());
    // пересылаем всем подключённым
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("Клиент отключился"));
});

console.log("Сервер запущен");