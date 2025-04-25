FROM node:23-slim
WORKDIR /app
COPY . .
COPY ./.env .
RUN npm install
EXPOSE 1482
CMD ["node", "server.js"]