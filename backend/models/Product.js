const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_Name: {
    type: String,
    required: true,
    maxlength: 255 // จำกัดความยาวชื่อสินค้า
  },
  product_Quantity: {
    type: Number,
    required: true,
    min: 0 // ปริมาณสินค้าต้องไม่น้อยกว่า 0
  },
  product_Stock: {
    type: Number,
    required: true,
    min: 0 // ปริมาณคงเหลือต้องไม่น้อยกว่า 0
  },
  product_Price: {
    type: Number, // FLOAT ใน MySQL → ใช้ Number ใน Mongoose
    required: true,
    min: 0 // ราคาต้องไม่น้อยกว่า 0
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit', // อ้างอิงไปยัง Model หน่วยสินค้า (Unit)
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory', // อ้างอิงไปยัง Model ประเภทสินค้า
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);
