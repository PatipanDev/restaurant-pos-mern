const mongoose = require('mongoose');

// สร้าง Schema สำหรับเครื่องดื่ม
const drinkSchema = new mongoose.Schema({
  drink_Name: {
    type: String,
    required: true,
    maxlength: 100,  // จำกัดความยาวชื่อเครื่องดื่มไม่เกิน 100 ตัวอักษร
  },
  drink_Price: {
    type: Number,
    required: true,
  },
  drink_Quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  drink_Stock_quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  drink_Manufacture_date: {
    type: Date,
    required: true,
  },
  drink_Expiry_date: {
    type: Date,
    required: true,
  },
  drink_Image: {
    type: String, // เก็บ URL ของรูปภาพ
    default: "", // ค่าดีฟอลต์คือค่าว่าง
  },
}, {
  timestamps: true, // เพิ่ม createdAt และ updatedAt
});

// สร้าง Model สำหรับ Drink
module.exports = mongoose.model('Drink', drinkSchema);
