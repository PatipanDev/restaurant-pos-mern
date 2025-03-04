const mongoose = require('mongoose');

const CashierSchema = new mongoose.Schema({
  cashier_Name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  cashier_Password: {
    type: String,
    required: true,
  },
  cashier_Address: {
    type: String,
    required: true,
  },
  cashier_Weight: {
    type: Number,
    required: true,
    min: 1,
    max: 999, // INT(3) รองรับได้สูงสุด 999
  },
  cashier_Height: {
    type: Number,
    required: true,
    min: 1,
    max: 999, // INT(3) รองรับได้สูงสุด 999
  },
  cashier_Gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  cashier_Birthdate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Cashier', CashierSchema);

