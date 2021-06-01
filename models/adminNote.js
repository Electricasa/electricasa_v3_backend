const mongoose = require('mongoose');


const adminNoteSchema = new mongoose.Schema({
    address: {type: mongoose.Schema.Types.ObjectId},
    body: String,
    date: Date
  }, {
    timestamps: true
  })
 

module.exports = mongoose.model('AdminNote', adminNoteSchema);