import { validateForm } from '../server/validation.js';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../server/auth.js';
import { renderProductList } from '../server/products.js';
import { products } from "../server/mockDB.js";

// Для login.html
if (document.querySelector('.login-container')) {
  const form = document.querySelector('form');
  const loginInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const submitBtn = form.querySelector('button');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { isValid, loginError, passwordError } = validateForm(loginInput.value, passwordInput.value);
    if (!isValid) {
      alert(`${loginError}`);
      return;
    }
    const result = loginUser(loginInput.value, passwordInput.value);
    if (result.success) {
      alert('Вход успешен!');
      window.location.href = 'index.html';
    } else {
      alert(result.error);
    }
  });

  // Для регистрации (добавьте кнопку или переключатель)
  // Аналогично, но с registerUser
}

// Для index.html
if (document.querySelector('.cards')) {
  const container = document.querySelector('.cards');
  renderProductList(container);
}

async function loadPartials() {
  const header = await fetch("other/header.html").then(res => res.text());
  document.getElementById("header").innerHTML = header;

  const footer = await fetch("other/footer.html").then(res => res.text());
  document.getElementById("footer").innerHTML = footer;
}

loadPartials();

// Для product.html
if (document.querySelector('.product-page')) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
      document.querySelector('.product-page img').src = product.image;
      document.querySelector('.product-info h1').textContent = product.name;
      document.querySelector('.product-info p').textContent = product.description;
      document.querySelector('.product-info .price').textContent = `${product.price} ₽`;

    }
  }
}