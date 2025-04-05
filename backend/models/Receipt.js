const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    Receipt_ID: {
        type: String,
        unique: true, 
    },
    payment_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    cashier_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cashier',
        required: true,
    },
    order_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
}, {
    timestamps: true, // สร้าง createdAt และ updatedAt อัตโนมัติ
});

ReceiptSchema.pre('save', async function (next) {
    if (!this.Receipt_ID) {
        const latestOrder = await this.constructor.findOne({ Receipt_ID: { $ne: null } }).sort({ _id: -1 });

        let lastNumber = 0;
        if (latestOrder && latestOrder.Receipt_ID && latestOrder.Receipt_ID.includes('-')) {
            const parts = latestOrder.Receipt_ID.split('-');
            lastNumber = parseInt(parts[1]) || 0;
        }

        this.Receipt_ID = `Order-${String(lastNumber + 1).padStart(10, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
