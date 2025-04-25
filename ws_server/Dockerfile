FROM node:23-slim
WORKDIR /app
COPY . .
COPY ./.env .
RUN npm install
EXPOSE 1483
CMD ["node", "server.js"]
