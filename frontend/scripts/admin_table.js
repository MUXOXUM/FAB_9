document.addEventListener('DOMContentLoaded', fetchProducts);
document.getElementById('addProductForm').addEventListener('submit', addProduct);

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Ошибка загрузки котов:", error);
    }
}

function renderProducts(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    products.forEach(product => {
        tableBody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td><input class="form-control" value="${product.name}" id="name-${product.id}"></td>
                <td><input class="form-control" type="number" value="${product.price}" id="price-${product.id}"></td>
                <td><input class="form-control" value="${product.description}" id="description-${product.id}"></td>
                <td><input class="form-control" value="${product.categories.join(', ')}" id="categories-${product.id}"></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="updateProduct(${product.id})">Сохранить</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Удалить</button>
                </td>
            </tr>`;
    });
}

async function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const categories = document.getElementById('categories').value.split(',').map(cat => cat.trim());

    try {
        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ name, price, description, categories }])
        });

        event.target.reset();
        fetchProducts();
    } catch (error) {
        console.error("Ошибка добавления кота:", error);
    }
}

async function updateProduct(id) {
    const name = document.getElementById(`name-${id}`).value;
    const price = document.getElementById(`price-${id}`).value;
    const description = document.getElementById(`description-${id}`).value;
    const categories = document.getElementById(`categories-${id}`).value.split(',').map(cat => cat.trim());

    try {
        await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, description, categories })
        });

        fetchProducts();
    } catch (error) {
        console.error("Ошибка обновления кота:", error);
    }
}

async function deleteProduct(id) {
    if (!confirm('Удалить этого кота?')) return;
    try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    } catch (error) {
        console.error("Ошибка удаления кота:", error);
    }
}