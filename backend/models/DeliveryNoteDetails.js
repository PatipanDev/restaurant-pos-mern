const mongoose = require('mongoose');

const DeliveryNoteDetailsSchema = new mongoose.Schema({
    delivery_Quantity: {
        type: Number,
        required: true
    },
    delivery_Price: {
        type: mongoose.Schema.Types.Decimal128, // ใช้ Decimal128 เพื่อเก็บค่าทศนิยมอย่างแม่นยำ
        required: true
    },
    delivery_Note_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryNote',
        required: true
    },
    product_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
});

module.exports = mongoose.model('DeliveryNoteDetails', DeliveryNoteDetailsSchema);

