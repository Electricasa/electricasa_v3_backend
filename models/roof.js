const mongoose = require('mongoose');

const roofSchema = mongoose.Schema({
  roofImg: { type: String },
  exterior: { type : String },
  roofColor: {type: String},
  pvSystem: {type: String},
  panels: {type: String},
  dcCapacity: {type: String},
  userId  : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  }
});

module.exports = mongoose.model('Roof', roofSchema)
