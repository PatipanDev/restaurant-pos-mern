const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customer_Name: { type: String, required: true, trim: true },
    customer_Email: { type: String, required: true, unique: true, trim: true },
    customer_Password: { type: String, required: true },
    customer_Telnum: { 
        type: String, 
        required: true, 
        match: [/^\d{10}$/, 'เบอร์โทรศัพท์ต้องมี 10 ตัวเลข'] 
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);