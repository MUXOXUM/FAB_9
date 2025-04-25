let allProducts = [];
let selectedCategory = null;

async function loadProducts() {
    const query = `{
        products {
            name
            price
            categories
        }
    }`;

    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    const result = await response.json();
    allProducts = result.data.products;
    console.log(allProducts)
    renderCategories();
    renderProducts();
}

function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categories = new Set();

    allProducts.forEach(product => {
        product.categories.forEach(category => categories.add(category));
    });

    categoriesContainer.innerHTML = `
        <button class="btn btn-outline-primary m-1" onclick="filterByCategory(null)">Все коты</button>
        ${Array.from(categories).map(category =>
        `<button class="btn btn-outline-primary m-1" onclick="filterByCategory('${category}')">${category}</button>`
    ).join('')}
    `;
}

function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';

    const filteredProducts = selectedCategory
        ? allProducts.filter(product => product.categories.includes(selectedCategory))
        : allProducts;

    if (filteredProducts.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">Коты отсутствуют</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        container.innerHTML += `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${product.price} ₽</h6>
                        <p><strong>Породы:</strong> ${product.categories.join(', ')}</p>
                    </div>
                </div>
            </div>`;
    });
}

function filterByCategory(category) {
    selectedCategory = category;
    renderProducts();
}

loadProducts();