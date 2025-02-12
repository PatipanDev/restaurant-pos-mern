const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // ชื่อวัตถุดิบ เช่น "แป้ง", "ไข่"
    quantity: { type: Number, required: true }, // จำนวนวัตถุดิบที่มีอยู่ในสต็อก
    unit: { type: String, required: true }, // หน่วย เช่น "กรัม", "ฟอง"
  });

module.exports = mongoose.model("Ingredient", ingredientSchema);