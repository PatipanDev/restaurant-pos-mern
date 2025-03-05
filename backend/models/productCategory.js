const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    maxlength: 100
  }
});

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);
