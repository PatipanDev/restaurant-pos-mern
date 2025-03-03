const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  Chef_Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  Chef_Password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  Chef_Type: {
    type: String,
    required: true,
    maxlength: 50
  },
  Chef_Details: {
    type: String,
    required: true
  },
  
  Chef_Birthday: {
    type: Date,
    required: true
  },
  Chef_HW: {
    type: String,
    required: true,
    maxlength: 20
  }
}, {
  timestamps: true // เพิ่ม createdAt และ updatedAt อัตโนมัติ
});

module.exports = mongoose.model('Chef', chefSchema);


