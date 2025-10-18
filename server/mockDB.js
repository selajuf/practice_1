let users = [];
let products = [];
let dataLoaded = false;

export function loadData(callback) {
  if(dataLoaded) {
    if(callback) callback();
    return;
  }
  
  fetch('/server/users.json')
    .then(res => res.json())
    .then(data => {
      users = data;
      return fetch('/server/products.json');
    })
    .then(res => res.json())
    .then(data => {
      products = data;
      dataLoaded = true;
      if(callback) callback();
    });
}

export function getUsers() {
  return users;
}

export function saveUsers(newUsers) {
  users = newUsers;
  
  fetch('http://localhost:3000/api/save-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users)
  })
  .then(res => res.json())
  .then(data => {
    if(data.success) {
      console.log('Сохранено');
    }
  })
  .catch(err => console.error(err));
}

export function getProducts() {
  return products;
}

export function saveProducts(newProducts) {
  products = newProducts;
  
  fetch('http://localhost:3000/api/save-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  })
  .then(res => res.json())
  .then(data => {
    if(data.success) {
      console.log('Сохранено');
    }
  })
  .catch(err => console.error(err));
}
