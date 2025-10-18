import { getUsers, saveUsers, getProducts, saveProducts, loadData } from '../server/mockDB.js';
import { getCurrentUser, isAdmin, logoutUser } from '../server/auth.js';

window.addEventListener('DOMContentLoaded', () => {
  if(!isAdmin()) {
    alert('Доступ запрещен!');
    window.location.href = 'login.html';
    return;
  }
  
  loadData(() => {
    loadUsers();
    loadProducts();
  });
});

window.switchTab = function(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`${tab}-tab`).classList.add('active');
}
window.logout = function() {
  logoutUser();
}

let users = [];

function loadUsers() {
  users = getUsers();
  renderUsers();
}

function renderUsers() {
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.login}</td>
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editUser(${user.id})">Изменить</button>
        <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Удалить</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

window.openUserModal = function(userId = null) {
  const modal = document.getElementById('user-modal');
  const form = document.getElementById('user-form');
  const title = document.getElementById('user-modal-title');
  
  if(userId) {
    const user = users.find(u => u.id === userId);
    title.textContent = 'Редактировать пользователя';
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-login').value = user.login;
    document.getElementById('user-password').value = user.password;
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-role').value = user.role;
  } else {
    title.textContent = 'Добавить пользователя';
    form.reset();
  }
  
  modal.classList.add('active');
}

window.closeUserModal = function() {
  document.getElementById('user-modal').classList.remove('active');
}

window.editUser = function(id) {
  openUserModal(id);
}

window.deleteUser = function(id) {
  if(!confirm('Удалить этого пользователя?')) return;
  
  users = users.filter(u => u.id !== id);
  saveUsers(users);
  renderUsers();
}

document.getElementById('user-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const userId = document.getElementById('user-id').value;
  const userData = {
    id: userId ? parseInt(userId) : users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    login: document.getElementById('user-login').value,
    password: document.getElementById('user-password').value,
    name: document.getElementById('user-name').value,
    role: document.getElementById('user-role').value
  };
  
  if(userId) {
    const index = users.findIndex(u => u.id === parseInt(userId));
    users[index] = userData;
  } else {
    users.push(userData);
  }
  
  saveUsers(users);
  renderUsers();
  closeUserModal();
});


let products = [];

function loadProducts() {
  products = getProducts();
  renderProducts();
}

function renderProducts() {
  const tbody = document.querySelector('#products-table tbody');
  tbody.innerHTML = '';
  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.description.substring(0, 50)}...</td>
      <td>${product.price} ₽</td>
      <td>
        <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Изменить</button>
        <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Удалить</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

window.openProductModal = function(productId = null) {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const title = document.getElementById('product-modal-title');
  
  if(productId) {
    const product = products.find(p => p.id === productId);
    title.textContent = 'Редактировать товар';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
  } else {
    title.textContent = 'Добавить товар';
    form.reset();
  }
  
  modal.classList.add('active');
}

window.closeProductModal = function() {
  document.getElementById('product-modal').classList.remove('active');
}

window.editProduct = function(id) {
  openProductModal(id);
}

window.deleteProduct = function(id) {
  if(!confirm('Удалить этот товар?')) return;
  
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  renderProducts();
}

const SUPABASE_URL = 'https://hfszwgjwistfvqmlpqli.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc3p3Z2p3aXN0ZnZxbWxwcWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NjE1OTcsImV4cCI6MjA3NTAzNzU5N30.mwtT2Wf6BfG3ORp7auqIdkGqpMpSuJzIAoLWpnv6c7E';

function uploadToSupabase(file, callback) {
  const fileName = Date.now() + '_' + file.name.replace(/\s/g, '_');
  
  fetch(`${SUPABASE_URL}/storage/v1/object/products/${fileName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'x-upsert': 'false'
    },
    body: file
  })
  .then(res => {
    if(res.ok) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;
      callback(publicUrl);
    } else {
      callback(null);
    }
  })
  .catch(err => {
    console.error(err);
    callback(null);
  });
}

document.getElementById('product-image-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(file) {
    const imageInput = document.getElementById('product-image');
    imageInput.value = 'Загрузка...';
    imageInput.disabled = true;
    
    uploadToSupabase(file, function(url) {
      if(url) {
        imageInput.value = url;
        imageInput.disabled = false;
      } else {
        imageInput.value = '';
        imageInput.disabled = false;
        alert('Ошибка загрузки в Supabase');
      }
    });
  }
});

document.getElementById('product-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const productId = document.getElementById('product-id').value;
  const productData = {
    id: productId ? parseInt(productId) : products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: document.getElementById('product-name').value,
    description: document.getElementById('product-description').value,
    price: parseInt(document.getElementById('product-price').value),
    image: document.getElementById('product-image').value
  };
  
  if(productId) {
    const index = products.findIndex(p => p.id === parseInt(productId));
    products[index] = productData;
  } else {
    products.push(productData);
  }
  
  saveProducts(products);
  renderProducts();
  closeProductModal();
});