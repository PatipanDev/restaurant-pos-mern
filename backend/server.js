const express = require('express');  
require('dotenv').config();
const PORT = process.env.PORT
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const ShopOwner = require('./models/ShopOwner');

const app = express();

// เชื่อมต่อ MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*'}));

app.use((req, res, next) => {
    // กำหนดการอนุญาตการเข้าถึงจากทุก origin
    res.header('Access-Control-Allow-Origin', '*');
    
    // กำหนด headers ที่อนุญาตให้ client ใช้งานได้
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // กำหนดวิธีการที่อนุญาตให้ใช้ใน request (เช่น GET, POST, PUT, DELETE)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // ไปยังขั้นตอนถัดไป
    next();
})

// Routes
app.use('/api/auth', authRoutes);
//connectDataase

// ✅ สร้าง Route (หน้าหลัก)
app.get('/', (req, res) => {
    res.send('Hello Express.js 🚀');
});


// ✅ เริ่มต้น Server
app.listen(PORT, () => {
    console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET); 
    const currentTime = new Date().toLocaleString(); // ใช้เพื่อแสดงเวลาในรูปแบบที่อ่านง่าย
    console.log(`🚀 Server is running at http://localhost:${PORT} time: ${currentTime}`);
});

app.use(ShopOwner)
