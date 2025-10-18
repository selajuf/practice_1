const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

app.post('/api/save-users', (req, res) => {
  const users = req.body;
  const filePath = path.join(__dirname, 'server', 'users.json');
  
  fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Ошибка записи users.json:', err);
      return res.status(500).json({ error: 'Ошибка сохранения' });
    }
    res.json({ success: true });
  });
});

app.post('/api/save-products', (req, res) => {
  const products = req.body;
  const filePath = path.join(__dirname, 'server', 'products.json');
  
  fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
    if (err) {
      console.error('Ошибка записи products.json:', err);
      return res.status(500).json({ error: 'Ошибка сохранения' });
    }
    res.json({ success: true });
  });
});

