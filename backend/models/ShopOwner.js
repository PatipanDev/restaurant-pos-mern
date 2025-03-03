const mongoose = require('mongoose');

const shopOwnerSchema = new mongoose.Schema({
  owner_Password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  owner_Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  owner_Details: {
    type: String,
    required: true
  }
});

const ShopOwner = mongoose.model('ShopOwner', shopOwnerSchema);

module.exports = ShopOwner;


