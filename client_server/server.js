const clientPort = 1482;

const express = require('express');
const path = require('path');
const fs = require('fs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

// Создаем схему GraphQL
const schema = buildSchema(`
    type Product {
        id: Int
        name: String
        price: String
        description: String
        categories: [String]
    }

    type Query {
        products: [Product]
        product(id: Int!): Product
    }
`);

const readProductsData = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8'));
};

const root = {
    products: () => readProductsData(),
    product: ({ id }) => {
        const products = readProductsData();
        return products.find(product => product.id === id);
    }
};

// Настроим GraphQL сервер
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Включаем GraphiQL для тестирования запросов через браузер
}));

// Статичные файлы
app.use(express.static(path.join(__dirname, '../frontend')));

// Основной маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/client.html'));
});

// Логирование запросов
app.use((req, res, next) => {
    console.log(`Запрос: ${req.method} ${req.url}`);
    next();
});

// Обработка ошибки 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/error_404.html'));
});

// Обработка ошибки 500
app.use((err, req, res, next) => {
    console.error('Ошибка 500:', err.stack); // Логируем ошибку
    res.status(500).sendFile(path.join(__dirname, '../frontend/error_500.html'));
});

// Запуск сервера
app.listen(clientPort, () => console.log(`[NOTE] Client сервер запущен на http://localhost:${clientPort}`));
