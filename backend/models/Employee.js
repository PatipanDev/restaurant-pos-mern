const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employee_Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  employee_Password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  employee_Citizen_id: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{13}$/ // ตรวจสอบว่าเป็นตัวเลข 13 หลัก
  },
  employee_Weight: {
    type: Number,
    required: true,
    min: 1,
    max: 500
  },
  employee_Height: {
    type: Number,
    required: true,
    min: 30,
    max: 250
  },
  employee_Address: {
    type: String,
    required: true
  },
  employee_Details: {
    type: String,
    required: true
  },
  employee_Birthday: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // เพิ่ม createdAt และ updatedAt อัตโนมัติ
});

module.exports = mongoose.model('Employee', employeeSchema);

