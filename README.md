# Интернет-магазин "Кошачий рай"

### 1. Клонируем проект
```bash
git clone https://github.com/MUXOXUM/FAB_9.git
```

### 2. Запускаем Docker
В корневой директории прописать команду

```bash
docker-compose up -build
```

### 3. Открываем в браузере
- Админ-панель через API: http://localhost:1481
- Клиентская часть через GraphQL: http://localhost:1482
- Чат поддержки через веб-сокет: http://localhost:1483

## Особенности
В рамках данного задания необходимо реализовать и настроить Docker и Docker Compose таким образом, чтобы запуск приложения из Базового задания №4 (https://github.com/MUXOXUM/FAB_4.git) выполнялся по команде docker-compose up --build или альтернативной