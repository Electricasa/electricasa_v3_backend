const mongoose = require('mongoose');

const atticSchema = mongoose.Schema({
  atticImg: { type: String },
  atticType: {type: String},
  atticSqft: {type: String},
  atticDepth: {type: String},
  insulMaterial: {type: String},
  airSealed: {type: String},
  userId: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model('Attic', atticSchema)
