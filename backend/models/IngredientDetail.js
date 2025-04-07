const mongoose = require('mongoose');

const IngredientDetailSchema = new mongoose.Schema({
  IngredientDt_Qua: {
    type: Number,
  },
  ingredient_Id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ingredient',
  },
  product_Id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
  },
});

module.exports = mongoose.model('IngredientDetail', IngredientDetailSchema);

