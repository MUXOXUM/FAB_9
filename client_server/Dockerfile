FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:1482/health || exit 1
EXPOSE 1482
CMD ["node", "server.js"]