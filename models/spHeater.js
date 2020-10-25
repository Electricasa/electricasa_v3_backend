const mongoose = require('mongoose');

const spHeaterSchema = mongoose.Schema({
  spHeaterImg: { type: String },
  spHeaterType: { type: String },
  atticSqft: { type: String },
  spHeaterYear: { type: String },
  spHeaterCondition : { type: String },
  coolingSystem : { type: String },
  userId: {type: String},
});

module.exports = mongoose.model('spheater', spHeaterSchema)
