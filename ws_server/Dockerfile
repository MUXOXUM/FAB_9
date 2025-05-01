FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:1483/health || exit 1
EXPOSE 1483
CMD ["node", "server.js"]
