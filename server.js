const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

// Render назначает порт через переменную окружения
const PORT = process.env.PORT || 8080;

// HTTP сервер для отдачи index.html
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// WebSocket сервер поверх HTTP
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Новый клиент подключился");
  ws.username = `User${wss.clients.size}`
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