const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
  houseImg: { type: String },
  address: { type : String },
  city: {type: String},
  state: {type: String},
  zipcode: {type: String},
  houseYear: {type: String},
  houseSqft: {type: String},
  userId: {type: String},
});

module.exports = mongoose.model('House', houseSchema)
