const mongoose = require('mongoose');

// สร้าง Schema สำหรับ Table
const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true, // ให้เป็น unique เพื่อไม่ให้มีหมายเลขโต๊ะซ้ำ
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Reserved'], // กำหนดสถานะเป็น ENUM
    default: 'Available', // ค่า default คือ 'Available'
  },
  seat_count: {
    type: Number,
    required: true,
    min: 1, // จำนวนที่นั่งต้องไม่น้อยกว่า 1
    max: 10, // จำนวนที่นั่งไม่เกิน 10 (สามารถปรับตามความต้องการ)
  },
}, {
  timestamps: true, // เพิ่มฟิลด์ createdAt และ updatedAt
});

// สร้าง Model สำหรับ Table
module.exports = mongoose.model('Table', tableSchema);


