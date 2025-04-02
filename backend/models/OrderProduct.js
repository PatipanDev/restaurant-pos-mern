const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
    order_time: {
        type: String, // ใช้ String เนื่องจาก Mongoose ไม่มีชนิด TIME โดยตรง
    },
    order_date: {
        type: Date,
    },
    delivery_date: {
        type: Date,
    },
    document_number: {
        type: String,
        unique: true, 
    },
    chef_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chef',
        default: undefined
    },
    owner_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopOwner',
        default: undefined
    },
    supplier_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        default: undefined
    },
    order_Status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending',  // ค่าเริ่มต้นเป็น Pending
        required: true,
    },
}, { timestamps: true });

// Middleware: สร้าง `document_number` อัตโนมัติถ้ายังไม่มีค่า
OrderProductSchema.pre('save', async function (next) {
    if (!this.document_number) {
        const latestOrder = await this.constructor.findOne({ document_number: { $ne: null } }).sort({ _id: -1 });

        let lastNumber = 0;
        if (latestOrder && latestOrder.document_number && latestOrder.document_number.includes('-')) {
            const parts = latestOrder.document_number.split('-');
            lastNumber = parseInt(parts[1]) || 0;
        }

        this.document_number = `Order-${String(lastNumber + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('OrderProduct', OrderProductSchema);
