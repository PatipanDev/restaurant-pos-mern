const mongoose = require('mongoose');

const IngredientDetailSchema = new mongoose.Schema({
  IngredientDt_Qua: {
    type: Number,
  },
  ingredient_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ingredient',
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
  },
});

module.exports = mongoose.model('IngredientDetail', IngredientDetailSchema);

