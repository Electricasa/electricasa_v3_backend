const mongoose = require('mongoose');

const roofSchema = mongoose.Schema({
  roofImg: { type: String },
  exterior: { type : String },//dropBox
  roofColor: {type: String},
  pvSystem: {type: String},
  panels: {type: String},
  dcCapacity: {type: String},
  userId: {type: String},
});

module.exports = mongoose.model('Roof', roofSchema)
