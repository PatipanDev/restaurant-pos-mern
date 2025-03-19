const express = require('express');
const path = require('path');  // เพิ่มบรรทัดนี้
require('dotenv').config();
const PORT = process.env.PORT;
const connectDB = require('./config/db');
//เราท์เตอร์
const authRoutes = require('./routes/authRoutes');
const manageRoutes = require('./routes/manageRoutes');
const userRoutes = require('./routes/userRoutes')
const foodRoutes = require('./routes/foodRoutes')


const cors = require('cors');
const cookieParser = require("cookie-parser");

const ShopOwner = require('./models/ShopOwner');

const app = express();

// เชื่อมต่อ MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ตั้งค่า CORS
app.use(cors({
    // origin: "http://localhost:5173", // Frontend URL
    origin: "http://192.168.1.6:5173",
    credentials: true,  // อนุญาตให้ส่งคุกกี้
}));


// Routes
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/data', manageRoutes);
// เส้นทางสำหรับอัปโหลดไฟล์
app.use('/api/food', foodRoutes)


app.use('/images', express.static(path.join(__dirname, 'uploads' ,'image')));
app.use('/imagesdrink', express.static(path.join(__dirname, 'uploads' ,'drink-images')));


// สร้าง Route (หน้าหลัก)
app.get('/', (req, res) => {
    res.send('Hello Express.js 🚀');
});

// เริ่มต้น Server
app.listen(PORT, () => {
    console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET);
    const currentTime = new Date().toLocaleString();
    console.log(`🚀 Server is running at http://localhost:${PORT} time: ${currentTime}`);
});
