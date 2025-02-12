const mongoose = require('mongoose');

// โมเดลอาหาร (Food)
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // เช่น อาหารคาว, อาหารหวาน
    imageUrl: { type: String }, // URL ของรูปอาหาร
    ingredients: [
      {
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient", required: true },
        amount: { type: Number, required: true }, // ปริมาณวัตถุดิบที่ใช้
        unit: { type: String, required: true }, // หน่วยของวัตถุดิบ
      },
    ],
});
  
module.exports = mongoose.model("Food", foodSchema);