import { validateForm } from '../server/validation.js';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../server/auth.js';
import { renderProductList, getProductById } from '../server/products.js';
import { loadData } from '../server/mockDB.js';

if (document.querySelector('.login-container')) {
  loadData(() => {
    const form = document.querySelector('form');
    const loginInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const nameInput = form.querySelector('input[name="name"]');
    const submitBtn = form.querySelector('button');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { isValid, loginError, passwordError } = validateForm(loginInput.value, passwordInput.value);
      if (!isValid) {
        alert(`${loginError}`);
        return;
      }
      
      const isRegister = form.classList.contains('register-mode');
      
      if(isRegister) {
        if(!nameInput || !nameInput.value) {
          alert('Введите имя');
          return;
        }
        const result = registerUser(loginInput.value, passwordInput.value, nameInput.value);
        if (result.success) {
          alert('Регистрация успешна!');
          window.location.href = 'login.html';
        } else {
          alert(result.error);
        }
      } else {
        const result = loginUser(loginInput.value, passwordInput.value);
        if (result.success) {
          alert('Вход успешен!');
          
          if(result.user.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        } else {
          alert(result.error);
        }
      }
    });
  });
}

// Для index.html
if (document.querySelector('.cards')) {
  const container = document.querySelector('.cards');
  loadData(() => {
    renderProductList(container);
  });
}

function loadPartials() {
  fetch("other/header.html").then(res => res.text()).then(html => {
    document.getElementById("header").innerHTML = html;
    updateHeaderLinks();
  });

  fetch("other/footer.html").then(res => res.text()).then(html => {
    document.getElementById("footer").innerHTML = html;
  });
}

function updateHeaderLinks() {
  const user = getCurrentUser();
  const loginLink = document.getElementById('login-link');
  const adminLink = document.getElementById('admin-link');
  
  if(user) {
    loginLink.textContent = 'Выход';
    loginLink.href = '#';
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
    
    if(user.role === 'admin') {
      adminLink.style.display = 'inline';
    }
  }
}

loadPartials();

// Для product.html
if (document.querySelector('.product-page') && window.location.pathname.includes('products.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    loadData(() => {
      const product = getProductById(productId);
      if (product) {
        document.querySelector('.product-page img').src = product.image;
        document.querySelector('.product-info h1').textContent = product.name;
        document.querySelector('.product-info p').textContent = product.description;
        document.querySelector('.product-info .price').textContent = `${product.price} ₽`;
      }
    });
  }
}