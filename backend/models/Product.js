const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_Name: {
    type: String,
    required: true,
    maxlength: 255
  },
  product_Quantity: {
    type: Number,
    required: true,
    min: 0 // ปริมาณสินค้าต้องไม่น้อยกว่า 0
  },
  product_Ramquantity: {
    type: Number,
    required: true,
    min: 0 // ปริมาณคงเหลือต้องไม่น้อยกว่า 0
  },
  product_Price: {
    type: Number,
    required: true,
    min: 0 // ราคาต้องไม่น้อยกว่า 0
  },
  category_Id: {
    type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId สำหรับ foreign key
    ref: 'ProductCategory', // อ้างอิงไปยัง model ProductCategory
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);