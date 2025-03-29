const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    payment_Status: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed'],
        default: '' // ค่าเริ่มต้นเป็น String ว่าง
    },
    payment_Method: {
        type: String,
        default: '' // ค่าเริ่มต้นเป็น String ว่าง
    },
    change_Amount: {
        type: mongoose.Schema.Types.Decimal128,
        default: null // คงค่าเริ่มต้นเป็น null หากไม่ต้องการให้มีค่าเริ่มต้นเป็น 0
    },
    bank_Reference: {
        type: String,
        default: '' // ค่าเริ่มต้นเป็น String ว่าง
    },
    received_Amount: { // เพิ่มฟิลด์ "เงินที่รับมา"
        type: mongoose.Schema.Types.Decimal128,
        default: null, // ค่าเริ่มต้นเป็น null
    },
    paid_Amount: { // เงินที่ทำการชำระ
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    },
    payment_Time: {
        type: String, // Store as String in HH:MM:SS format
        default: '', // ค่าเริ่มต้นเป็น String ว่าง
    },
    payment_Date: {
        type: Date,
        default: null // ค่าเริ่มต้นเป็น null
    },
    order_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Assuming you have a 'FoodOrder' model
        required: true
    },
    customer_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Assuming you have a 'Customer' model
        default: null, // ค่าเริ่มต้นเป็น null
    },
    cashier_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cashier', // Assuming you have a 'Cashier' model
        default: null, // ค่าเริ่มต้นเป็น null
    }
});

module.exports = mongoose.model('Payment', paymentSchema);