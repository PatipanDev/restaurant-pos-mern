const mongoose = require('mongoose');

const shopOwnerSchema = new mongoose.Schema({
  owner_Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  owner_Password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  owner_Details: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ShopOwner', shopOwnerSchema);

// module.exports = ShopOwner;


