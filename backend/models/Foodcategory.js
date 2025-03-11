const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  food_Name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Foodcategory', foodSchema);