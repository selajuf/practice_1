import { getProducts, saveProducts } from "./mockDB.js"

export function loadProducts() {
    return getProducts();
}

export function renderProductCard(product) {
    return `
    <div class="card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <span class="price">${product.price} ₽</span>
    </div>
  `;
}

export function renderProductList(container) {
    const products = loadProducts();
    container.innerHTML = products.map(renderProductCard).join('');
    // Добавляем обработчики кликов
    container.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.id;
            window.location.href = `products.html?id=${productId}`;
        });
    });
}

export function getProductById(id) {
    const products = loadProducts();
    return products.find(p => p.id == id);
}