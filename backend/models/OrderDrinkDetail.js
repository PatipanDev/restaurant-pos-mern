const mongoose = require('mongoose');

const orderDrinkDetailSchema = new mongoose.Schema({
    order_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // อ้างอิงถึงโมเดล Order
        required: true,
      },
    drink_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drink', // อ้างอิงถึงโมเดล Drink
        default: null, // ค่าเริ่มต้นเป็น null
    },
    orderDetail_Quantity: {
        type: Number,
        required: true,
        min: 1, // กำหนดค่าต่ำสุดของจำนวน
        max: 10000, // กำหนดค่าสูงสุด (ถ้าต้องการ)
    },
    orderDetail_Serving: {
        type: String,
        enum: ['Not Served', 'Served', 'In Transit', 'Delivered', 'Returned'],
        required: true,
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
}, { timestamps: true });

module.exports = mongoose.model('OrderDrinkDetail', orderDrinkDetailSchema);