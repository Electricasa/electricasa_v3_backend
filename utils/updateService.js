const SALT_ROUNDS = 6;


function hashedPassword(){
    console.log("update firing models")
  // 'this' will be set to the current document
  const user = this;
  console.log(this, "this from findOneandUpdate")
  // check to see if the user has been modified, if not proceed 
  // in the middleware chain
  if (!user.isModified('password')) return next();
  console.log("update firing models 2")
  // password has been changed - salt and hash it
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    if (err) return next(err);
    // replace the user provided password with the hash
    user.password = hash;
    console.log("update firing models 3")
    next();
})
}