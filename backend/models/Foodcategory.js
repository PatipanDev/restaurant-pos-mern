const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Foodcategory', foodSchema);