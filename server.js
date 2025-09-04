const http = require("http");
const WebSocket = require("ws");

// Render назначает порт через переменную окружения
const PORT = process.env.PORT || 8080;

// Создаем HTTP сервер (можно расширить для статических файлов)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Server is running");
});

// Создаем WebSocket сервер поверх HTTP
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Новый клиент подключился");

  ws.on("message", (message) => {
    // Рассылаем сообщение всем подключённым клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("Клиент отключился"));
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});