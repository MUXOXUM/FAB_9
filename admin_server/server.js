require('dotenv').config({ path: '../.env' });
const adminPort = parseInt(process.env.ADMIN_PORT, 10);

if (isNaN(adminPort)) {
    console.error("ADMIN_PORT должен быть числом. Проверьте ваш .env файл.");
    process.exit(1); // Завершаем процесс с ошибкой
}

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const filePath = path.join(__dirname, '../products.json');

// Получить все товары
app.get('/api/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(filePath));
    res.json(products);
});

// Добавить товары
app.post('/api/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(filePath));
    const newProducts = req.body.map((product, index) => ({ id: products.length + index + 1, ...product }));
    products.push(...newProducts);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProducts);
});

// Редактировать товар по ID
app.put('/api/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync(filePath));
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).send('Товар не найден');
    products[index] = { ...products[index], ...req.body };
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    res.json(products[index]);
});

// Удалить товар по ID
app.delete('/api/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync(filePath));
    const id = parseInt(req.params.id);
    products = products.filter(p => p.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));c
    res.status(204).send();
});

// Страница админ-панели
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.use((req, res, next) => {
    console.log(`Запрос: ${req.method} ${req.url}`);
    next();
});

// Тестовый маршрут для ошибки 500
//app.get('/error', (req, res, next) => {
//    next(new Error('Тестовая ошибка 500')); // Вызываем ошибку
//});

// Обработка ошибки 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/error_404.html'));
});

// Обработка ошибки 500
app.use((err, req, res, next) => {
    console.error('Ошибка 500:', err.stack); // Логируем ошибку
    res.status(500).sendFile(path.join(__dirname, '../frontend/error_500.html'));
});

app.listen(adminPort, () => console.log(`[NOTE] Admin сервер запущен на http://localhost:${adminPort}`));