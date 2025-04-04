const express = require('express');
const path = require('path');
require('dotenv').config();
const socketIo = require('socket.io');
const http = require('http'); // ใช้ http โมดูล
const PORT = process.env.PORT;
const connectDB = require('./config/db');

// เราท์เตอร์
const authRoutes = require('./routes/authRoutes');
const manageRoutes = require('./routes/manageRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const graphRoutes = require('./routes/graphRouter')

const cors = require('cors');
const cookieParser = require("cookie-parser");


const app = express();

// สร้าง HTTP server โดยใช้ http.createServer() และเชื่อมต่อกับ app
const server = http.createServer(app);

// เชื่อมต่อ socket.io กับ server
const io = socketIo(server, {
    cors: {
      origin: "http://192.168.1.6:5173",  // อนุญาตให้ React frontend เข้าถึงได้
      methods: ["GET", "POST"],          // วิธีที่รองรับ
      allowedHeaders: ["Content-Type"],  // กำหนด headers ที่อนุญาต
      credentials: true                  // อนุญาตให้ส่งคุกกี้
    }
});

// // ตั้งค่าการเชื่อมต่อกับ socket.io


// เชื่อมต่อ MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
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
app.use('/api/graph', graphRoutes);
app.use('/api/food', foodRoutes)

const setupSocket = require("./controllers/socketController");
setupSocket(io);
// app.use('/api', setupSocket)

app.use('/images', express.static(path.join(__dirname, 'uploads' ,'image')));
app.use('/imagesdrink', express.static(path.join(__dirname, 'uploads' ,'drink-images')));


// สร้าง Route (หน้าหลัก)
app.get('/', (req, res) => {
    res.send('Hello Express.js 🚀');
});

// เริ่มต้น Server
server.listen(PORT, () => {
    console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET);
    const currentTime = new Date().toLocaleString();
    console.log(`🚀 Server is running at http://localhost:${PORT} time: ${currentTime}`);
});


