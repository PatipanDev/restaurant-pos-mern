const mongoose = require('mongoose');

const SETTING_ID = 'singleton-setting'; // กำหนด id เดียวตายตัว

const SettingWebSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: SETTING_ID,
  },
  logoName: {
    type: String,
    default: ""
  },
  logoNameOld: {
    type: String,
    default: ""
  },
  websiteName: {
    type: String,
    default: ""
  },
  websiteDescription: {
    type: String,
    default: ""
  },
  phoneNumber: {
    type: String,
    default: ""
  },
  eMail: {
    type: String,
    default: ""
  },
  lineId: {
    type: String,
    default: ""
  },
  facebookAccount: {
    type: String,
    default: ""
  },
  instagramAccount: {
    type: String,
    default: ""
  },
  xAccount: {
    type: String,
    default: ""
  },
  otherContact: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  primaryColor: {
    type: String,
    default: ""
  },
  secondaryColor: {
    type: String,
    default: ""
  },
  bannerImage: {
    type: String,
    default: ""
  },
  recommendedFoods: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('SettingWeb', SettingWebSchema);
