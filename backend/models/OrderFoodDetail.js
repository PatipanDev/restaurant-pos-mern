const mongoose = require('mongoose');

// สร้าง schema สำหรับ Order Detail
const orderFoodDetailSchema = new mongoose.Schema({
  orderDetail_Quantity: {
    type: Number,
    required: true,
    min: 1, // กำหนดค่าต่ำสุดของจำนวน
    max: 10000, // กำหนดค่าสูงสุด (ถ้าต้องการ)
  },
  orderDetail_Cooking: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    required: true,
  },
  orderDetail_Serving: {
    type: String,
    enum: ['Not Served', 'Served','Delivered', 'Returned'],
    required: true,
  },
  order_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // อ้างอิงถึงโมเดล Order
    default: null, // ค่าเริ่มต้นเป็น null
  },
  food_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food', // อ้างอิงถึงโมเดล Menu
    default: null, // ค่าเริ่มต้นเป็น null
  },
  chef_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef', // อ้างอิงถึงโมเดล Chef
    default: null, // ค่าเริ่มต้นเป็น null
  },
  employee_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // อ้างอิงถึงโมเดล Employee
    default: null, // ค่าเริ่มต้นเป็น null
  },
  orderDetail_More: {
    type: String,
    default: '', // ค่าเริ่มต้นเป็นค่าว่าง
  },
}, {
  timestamps: true, // จะเก็บวันที่สร้างและอัพเดต
});

// สร้างโมเดลจาก schema

module.exports = mongoose.model('OrderFoodDetail', orderFoodDetailSchema);

