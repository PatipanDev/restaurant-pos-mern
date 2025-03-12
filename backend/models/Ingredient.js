const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  ingredient_Quantity: {
    type: Number,
    required: true,
  },
  ingredient_Name: {
    type: String,
    required: true,
  },
  ingredient_Steps: {
    type: String,
    required: true,
  },
  ingredient_Exdate: {
    type: Date,
    required: true,
  },
  chef_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef', // อ้างอิงถึงโมเดล Chef
    required: true,
  },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
