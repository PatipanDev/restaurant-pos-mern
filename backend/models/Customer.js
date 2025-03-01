const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customer_Id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    customer_Name: { type: String, required: true, unique: true },
    customer_Email: { type: String, required: true, unique: true },
    customer_Password: { type: String, required: true },
    customer_Telnum: { type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
