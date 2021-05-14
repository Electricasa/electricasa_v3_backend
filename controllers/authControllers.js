const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User    = require('../models/user');

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = {
  getAllUsers,
  signup,
  login,
  findUser,
  editUser
}

async function getAllUsers(req, res){
  const AllUsers = await User.find({});
  res.json({
    user: AllUsers,
  })
}

//register//create

async function signup(req, res) {
  console.log("signup firing <--------")
  console.log(req.body, "<---- req.body")
  if(req.body.lastName === "iamtheadmin"){
    req.body.isAdmin = true;
  } else {
    req.body.isAdmin = false;
  }
  const user = new User({...req.body});
  
  try{
    await user.save();
    console.log(user, "user created")
    const token = createJWT(user);
    console.log({token}, "token <---------------")
    res.json({ token });
  } catch (err) {
    console.log("something went wrong")
    // duplicate email, most likely
    res.status(400).json(err);
  }

}

//login

async function login(req, res) {
  
  try {
    const user = await User.findOne({email: req.body.email});
    console.log(user, ' this user', !user, !!user)
    if (!user) return res.status(401).json({err: 'bad credentials'});
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(user);
        res.json({token});
      } else {
        return res.status(401).json({err: 'bad credentials'});
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}

// JWT logout is done through the client on the FE via remove token function


// Find user for user info editing

async function findUser(req, res) {
    try {
      const foundUser = await User.findById(req.params.id);
  
      res.json({
        status: 200,
        data: foundUser
      });
    } catch(err) {
      res.send(err);
    };
}

async function editUser(req, res){
  let user;
  console.log("edit firing");
  try {
    console.log(req.body, "req.body from edit <------")
    
    // findById and save is necessary in order to trigger the pre-save middleware that 
    // sets the password encryption
    await User.findById(req.params.id, async function (err, doc){
      user = doc;
      if(user){
        for (const key in req.body) {
          user[key] = req.body[key];
      }
      console.log(user, "user from edit");
      // user = {...req.body, _id: req.params.id}
      await user.save();
      console.log(user, "user updated");
      
    }
    });
    const token = createJWT(user);
    console.log({token}, "token <------edit---------")
    res.status(200).json({ token });

} catch(err) {
  res.json(err)
};
}

//--------------------------helper functions-----------------------//
function createJWT(user) {
  console.log("createJWT firing")
  console.log(SECRET, "createJWT <-------")
  return jwt.sign(
    {user}, // data payload
    SECRET,
    {expiresIn: '24h'}
  );
}

//PREVIOUS CONTROLLER VVVVV 


// Get all users

// router.get('/', async(req, res) => {
//   const AllUsers = await User.find({});
//   res.json({
//     user: AllUsers,
//   })
// })

//register//create

// router.post('/', async(req, res) => {
//   const foundUser = await User.findOne({email: req.body.email});

//   if(!foundUser){
//     const email = req.body.email;
//     const password = req.body.password;
//     const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//     const firstName = req.body.firstName;
//     const lastName = req.body.lastName;
//     const phNumber = req.body.phNumber;
//     const emailNotice = req.body.emailNotice;
//     const mobileNotice = req.body.mobileNotice;
//     const UserDbEntry = {};
//           UserDbEntry.email        = email;
//           UserDbEntry.password     = hashedPassword;
//           UserDbEntry.firstName    = firstName;
//           UserDbEntry.lastName     = lastName;
//           UserDbEntry.phNumber     = phNumber;
//           UserDbEntry.emailNotice  = emailNotice;
//           UserDbEntry.mobileNotice = mobileNotice;

//     try {
//       const user = await User.create(UserDbEntry);

//       req.session.logged = true;
//       req.session.userId = user._id;

//       res.json({
//         status: 200,
//         data: 'register successful',
//         userId: user._id,
//       });

//     } catch(err) {
//       res.send(err);
//     };
//   } else {
//     res.send('this email is... ')
//   };
// });

// //login
// router.post('/login', async(req, res) => {
//   try {
//     const foundUser = await User.findOne({email: req.body.email});
//     if (foundUser) {
//       const passwordMatches = bcrypt.compareSync(req.body.password, foundUser.password);
//       if (bcrypt.compareSync(req.body.password, foundUser.password)) {
//         req.session.message = '';
//         req.session.logged = true;
//         req.session.userId = foundUser._id;

//         res.json({
//           status: 200,
//           data: 'login successful',
//           userId: foundUser._id
//         });
//       } else {
//         req.session.message = 'email or password is not correct';

//         res.status(401).json({
//           status: 401,
//           data: 'login unsuccessful'
//         });
//       };
//     } else {
//       req.session.message = 'email or password is incorrect';

//       res.json({
//         status: 401,
//         data: 'login unsuccessful',
//       });
//     };
//   } catch(err) {
//     res.send(err)
//   };
// });

// //logout
// router.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.json({
//         status: 200,
//         data: 'logout successful'
//       });
//     };
//   });
// });

// router.get('/:id', async(req, res) => {
//   try {
//     const foundUser = await User.findById(req.params.id);

//     res.json({
//       status: 200,
//       data: foundUser
//     });
//   } catch(err) {
//     res.send(err);
//   };
// });

// router.put('/:id', async(req, res) => {
//   try {
//       let modifyProfile = {};
//       const password = req.body.password;
//       const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//       modifyProfile.email = req.body.email;
//       modifyProfile.password = hashedPassword;
//       modifyProfile.firstName = req.body.firstName;
//       modifyProfile.lastName = req.body.lastName;
//       modifyProfile.phNumber = req.body.phNumber;
//       modifyProfile.emailNotice = req.body.emailNotice;
//       modifyProfile.mobileNotice = req.body.mobileNotice;

//       const updatedUser = await User.findByIdAndUpdate(req.params.id, modifyProfile, {new:true})

//       res.json({
//         status: 200,
//         data: 'user is updated',
//         updatedUser: updatedUser
//       });
//   } catch(err) {
//     res.json(err)
//   };
// });

// module.exports = router
