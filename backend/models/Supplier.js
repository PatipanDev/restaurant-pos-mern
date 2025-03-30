const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplier_Address: {
    type: String,
    required: true,
    maxlength: 255
  },
  supplier_Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  supplier_Phone: {
    type: String,
    maxlength: 10
  },
  supplier_Name_Owner: {
    type: String,
    maxlength: 100
  },
  supplier_Details: {
    type: String
  }
});

module.exports = mongoose.model('Supplier', supplierSchema, 'suppliers'); // 'suppliers' is the name of the MongoDB collection

 