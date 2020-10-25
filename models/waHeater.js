const mongoose = require('mongoose');

const waheaterSchema = mongoose.Schema({
  waheaterImg: { type: String },
  waheatertype: {type: String},
  waheaterBrand: {type: String},
  waheaterYear: {type: String},
  waheaterCondition: {type: String},
  waheaterSingle : {type: String},
  userId: {type: String},
});

module.exports = mongoose.model('Waheater', waheaterSchema)
