const mongoose = require('mongoose');

const waheaterSchema = mongoose.Schema({
  waHeaterImg: { type: String },
  waHeatertype: {type: String},
  waHeaterBrand: {type: String},
  waHeaterYear: {type: String},
  waHeaterCondition: {type: String},
  waHeaterSingle : {type: String},
  userId: {type: String},
});

module.exports = mongoose.model('WaHeater', waheaterSchema)
