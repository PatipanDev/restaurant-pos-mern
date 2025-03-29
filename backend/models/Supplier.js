const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  Supplier_Address: {
    type: String,
    required: true,
    maxlength: 255
  },
  Supplier_Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  Supplier_Phone: {
    type: String,
    maxlength: 10
  },
  Supplier_Name_Owner: {
    type: String,
    maxlength: 100
  },
  Supplier_Details: {
    type: String
  }
});

module.exports = mongoose.model('Supplier', supplierSchema, 'suppliers'); // 'suppliers' is the name of the MongoDB collection

 