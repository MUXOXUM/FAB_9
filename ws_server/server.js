require('dotenv').config({ path: '../.env' });
const websocketPort = parseInt(process.env.WEBSOCKET_PORT, 10);

if (isNaN(websocketPort)) {
    console.error("WEBSOCKET_PORT должен быть числом. Проверьте ваш .env файл.");
    process.exit(1); // Завершаем процесс с ошибкой
}

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: websocketPort });

const clients = new Map();
const admins = new Set();

wss.on("connection", (ws) => {
    console.log("Новое подключение!");

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "init") {
            // Определяем пользователя (клиент или администратор)
            if (data.userId.startsWith("admin")) {
                admins.add(ws);
                ws.userId = data.userId;
                console.log(`Админ ${data.userId} подключен.`);
            } else {
                clients.set(data.userId, ws);
                ws.userId = data.userId;
                console.log(`Клиент ${data.userId} подключен.`);
            }
        }

        if (data.type === "message") {
            console.log(`Сообщение от ${data.from} к ${data.to}: ${data.text}`);

            if (data.to.startsWith("admin")) {
                // Отправляем сообщение всем администраторам
                admins.forEach((admin) => {
                    if (admin.readyState === WebSocket.OPEN) {
                        admin.send(JSON.stringify({ from: data.from, text: data.text }));
                    }
                });
            } else {
                // Сообщение клиенту
                const client = clients.get(data.to);
                if (client && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ from: data.from, text: data.text }));
                }
            }
        }
    });

    ws.on("close", () => {
        console.log(`Пользователь ${ws.userId} отключился.`);
        clients.delete(ws.userId);
        admins.delete(ws);
    });
});

console.log(`[NOTE] WebSocket-сервер запущен на ws://localhost:${websocketPort}`);
