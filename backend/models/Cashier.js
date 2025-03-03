const mongoose = require('mongoose');

const cashierSchema = new mongoose.Schema({
  cashier_Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  cashier_Password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  cashier_Address: {
    type: String,
    required: true
  },
  cashier_S_H: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(v); // ตรวจสอบรูปแบบ "65.5/170.0"
      },
      message: props => `${props.value} ไม่ใช่รูปแบบน้ำหนัก/ส่วนสูงที่ถูกต้อง`
    }
  },
  cashier_Gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  cashier_Birthdate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // บันทึก createdAt และ updatedAt อัตโนมัติ
});

module.exports = mongoose.model('Cashier', cashierSchema);


