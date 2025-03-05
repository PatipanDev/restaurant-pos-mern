const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  unit_Name: {
    type: String,
    required: true,
    unique: true,  // ป้องกันไม่ให้หน่วยซ้ำ
    maxlength: 50
  },
  unit_Symbol: {
    type: String,
    required: true,
    maxlength: 10 // เช่น "kg", "g", "pcs", "l"
  },
})

module.exports = mongoose.model('Unit', UnitSchema);