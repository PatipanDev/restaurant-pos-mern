const mongoose = require('mongoose');

const employeeSupplierSchema = new mongoose.Schema({
  employee_Sub_Name: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    maxlength: 255,
    trim: true,
  },
  job_Title: {
    type: String,
    maxlength: 50,
    trim: true,
  },
  date_Of_Birth: {
    type: Date,
    required: true,
  },
  national_Id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  supplier_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  }
});

module.exports = mongoose.model('EmployeeSupplier', employeeSupplierSchema);
