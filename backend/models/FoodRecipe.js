const mongoose = require('mongoose');

const foodrecipeSchema = new mongoose.Schema({
  recipes_Quantity: {
    type: Number,
    required: true,
    min: 0
  },
  recipes_Price: {
    type: Number,
    required: true,
    min: 0,
    set: (v) => Math.round(v * 100) / 100 // ปัดเศษทศนิยมให้เหลือ 2 ตำแหน่ง
  },
  food_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food', // อ้างอิงถึงโมเดล Chef
  },
  product_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // อ้างอิงถึงโมเดล Chef
  }
});

module.exports = mongoose.model('Foodrecipe', foodrecipeSchema);
