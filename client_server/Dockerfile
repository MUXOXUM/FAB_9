FROM node:18
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
EXPOSE 1482
CMD ["node", "server.js"]