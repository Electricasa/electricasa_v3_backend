const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

const userSchema = new mongoose.Schema({
  firstName: {type: String},
  lastName: {type: String},
  phNumber: {type: String},
  email: {type: String, required: true, lowercase: true, unique: true},
  password: {type: String},
  emailNotice: {type: String},
  mobileNotice : {type: String},
  isAdmin : {type: Boolean}
  // userId: {type: String}
}, {
  timestamps: true
});

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    // remove the password property when serializing doc to JSON
    delete ret.password;
    return ret;
  }
});

// Need this for .populate
userSchema.set('toObject', {
  transform: (doc, ret, opt) => {
   delete ret.password;
   return ret;
  }
})

// DO NOT DEFINE instance methods with arrow functions, 
// they prevent the binding of this
userSchema.pre('save', function(next) {
  console.log('save firing models')
  // 'this' will be set to the current document
  const user = this;
  // check to see if the user has been modified, if not proceed 
  // in the middleware chain
  if (!user.isModified('password')) return next();
  // password has been changed - salt and hash it
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    if (err) return next(err);
    // replace the user provided password with the hash
    user.password = hash;
    next();
  });
});

// userSchema.pre('updateOne', { document: true, query: false }, function(next) {
//   console.log("update firing models")
//   // 'this' will be set to the current document
//   const user = this;
//   console.log(this, "this from findOneandUpdate")
//   // check to see if the user has been modified, if not proceed 
//   // in the middleware chain
//   if (!user.isModified('password')) return next();
//   console.log("update firing models 2")
//   // password has been changed - salt and hash it
//   bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
//     if (err) return next(err);
//     // replace the user provided password with the hash
//     user.password = hash;
//     console.log("update firing models 3")
//     next();
//   });
// });

userSchema.methods.comparePassword = function(tryPassword, cb) {
    console.log(cb, ' this is cb')
  // 'this' represents the document that you called comparePassword on
  bcrypt.compare(tryPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);