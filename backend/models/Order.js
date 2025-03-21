const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_Dec: {
    type: String,
    required: false, // ถ้าคำสั่งซื้อไม่จำเป็นต้องใส่รายละเอียด
  },
  order_Eating_status: {
    type: String,
    enum: ['Takeout', 'Dine-in'],
    default: 'Dine-in',  
  },
  employee_Id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee',
  },
  customer_Id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
  },
  table_Id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Table',
  },
  order_Status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',  // ค่าเริ่มต้นเป็น Pending
    required: true,
  },
}, {
  timestamps: true, // จะบันทึกเวลาการสร้างและอัพเดตข้อมูลโดยอัตโนมัติ
});

// สร้างและ export โมเดล
module.exports = mongoose.model('Order', orderSchema);


