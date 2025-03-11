const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  chef_Name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  chef_Password: {
    type: String,
    required: true,
    maxlength: 255,
  },
  chef_Details: {
    type: String,
  },
  chef_Birthday: {
    type: Date,
  },
  chef_Weight: {
    type: Number,
  },
  chef_Height: {
    type: Number,
  },
});

module.exports = mongoose.model('Chef', chefSchema);