const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(express.json());

// อนุญาตให้ frontend เข้าถึง
app.use(cors({
  origin: 'http://localhost:5173', // หรือใช้ * เพื่ออนุญาตทุก origin (เฉพาะ dev)
  credentials: true
}));

const manageCategory = require('./routes/owner/manageCategory');
app.use('/api/owner/menu-types', manageCategory);

const manageMenu = require('./routes/owner/manageMenu');
app.use('/api/owner/menu', manageMenu);



module.exports = app; // <-- export app ไปใช้ใน server.js
app.listen(3000, ()=>{
    console.log('server running at http://localhost:3000')
})