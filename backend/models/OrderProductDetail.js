const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
    order_Quantity: {
        type: Number,
        required: true, // จำนวนสินค้าต้องมีค่าเสมอ
    },
    order_Detail: {
        type: String,
        maxlength: 255, // จำกัดความยาวให้ไม่เกิน 255 ตัวอักษร
    },
    product_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // เชื่อมโยงไปที่ Model 'Product'
        required: true,
    },
    orderproduct_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderProduct', // เชื่อมโยงไปที่ Model 'OrderProduct'
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('OrderProductDetail', OrderDetailSchema);