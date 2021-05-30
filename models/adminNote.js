const mongoose = require('mongoose');


const adminNoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    body: String,
    date: Date
  }, {
    timestamps: true
  })
 

module.exports = mongoose.model('AdminNote', adminNoteSchema);