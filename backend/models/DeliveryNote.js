const mongoose = require('mongoose');

const DeliveryNoteSchema = new mongoose.Schema({
    sender_Name: {
        type: String,
        required: true,
        maxlength: 100
    },
    receiver_Name: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true
    },
    shipment_Date: {
        type: Date,
        required: true
    },
    delivery_Status: {
        type: String,
        required: true,
        maxlength: 50
    },
    supplier_Id: {
        type: mongoose.Schema.Types.ObjectId, // อ้างอิงไปที่ Supplier Model
        ref: 'Supplier',
        required: true
    },
    orderproduct_id:{
        type: mongoose.Schema.Types.ObjectId, // อ้างอิงไปที่ Supplier Model
        ref: 'OrderProduct',
        required: true
    },
}, { timestamps: true }); // เพิ่ม createdAt & updatedAt อัตโนมัติ

module.exports  = mongoose.model('DeliveryNote', DeliveryNoteSchema);
