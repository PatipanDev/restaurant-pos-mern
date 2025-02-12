const express = require('express');  
require('dotenv').config();
const PORT = process.env.PORT
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();

// เชื่อมต่อ MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
//connectDataase
connectDB()

// ✅ สร้าง Route (หน้าหลัก)
app.get('/', (req, res) => {
    res.send('Hello Express.js 🚀');
});

// ✅ เริ่มต้น Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
