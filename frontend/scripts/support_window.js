document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.getElementById("chat-button");
    const chatContainer = document.getElementById("chat-container");
    const closeChat = document.getElementById("close-chat");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");

    // Получаем ID пользователя (отправителя) и ID собеседника (получателя)
    const userId = chatButton.dataset.userId || "customer_x";
    const recipientId = chatButton.dataset.recipientId || "admin_x";

    const ws = new WebSocket("ws://localhost:1483"); // указать порт сервера веб сокета

    ws.onopen = () => {
        console.log(`WebSocket подключен для ${userId}`);
        ws.send(JSON.stringify({ type: "init", userId }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.from) {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${data.from}: ${data.text}`;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    };

    chatButton.addEventListener("click", () => {
        chatContainer.style.display = "flex";
    });

    closeChat.addEventListener("click", () => {
        chatContainer.style.display = "none";
    });

    chatSend.addEventListener("click", () => {
        const message = chatInput.value;
        if (message) {
            const messageElement = document.createElement("div");
            messageElement.textContent = `Вы: ${message}`;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            ws.send(JSON.stringify({ type: "message", from: userId, to: recipientId, text: message }));
            chatInput.value = "";
        }
    });
});
