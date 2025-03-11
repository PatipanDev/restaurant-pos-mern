const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  food_Name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  food_Stock: {
    type: Number,
    min: 0, // สต็อกต้องเป็นจำนวนเต็มบวกหรือ 0
    maxlength: 5,
  },
  food_Price: {
    type: mongoose.Schema.Types.Decimal128, // ใช้ Decimal128 เพื่อเก็บค่าทศนิยมอย่างแม่นยำ
    required: true,
  },
  product_Category: {
    type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId เพื่ออ้างอิงถึง ProductCategory
    ref: 'ProductCategory', // อ้างอิงถึงโมเดล ProductCategory
  },
  chef_Id: {
    type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId เพื่ออ้างอิงถึง Chef
    ref: 'Chef', // อ้างอิงถึงโมเดล Chef
  },
  owner_Id: {
    type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId เพื่ออ้างอิงถึง ShopOwner
    ref: 'ShopOwner', // อ้างอิงถึงโมเดล ShopOwner
  },
});

module.exports = mongoose.model('Food', foodSchema);