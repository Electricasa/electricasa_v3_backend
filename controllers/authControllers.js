const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User    = require('../models/user');


router.get('/', async(req, res) => {
  const AllUsers = await User.find({});
  res.json({
    user: AllUsers,
  })
})


//register//create
router.post('/', async(req, res) => {
  //const username = req.body.username
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const UserDbEntry = {};
        //UserDbEntry.username     = username;
        UserDbEntry.email        = email;
        UserDbEntry.password     = hashedPassword;
  try{
    const user = await User.create(UserDbEntry);
    console.log("NEW User = ", User)

    req.session.logged = true; //once login is true,
    //req.session.username = req.body.username;
    req.session.userId = user._id;//

    res.json({
      status: 200,
      data: 'register successful',
      userId: user._id,
      // username: req.body.username
    });

  }catch(err){
    res.send(err)
  }
});

//login
router.post('/login', async(req, res) => {
  try{
    const foundUser = await User.findOne({username: req.body.username})
    if(foundUser){
      // console.log("Passwords = ", req.body.password, foundUser.password)
      const passwordMatches = bcrypt.compareSync(req.body.password, foundUser.password);
      // console.log("PASSWORD MATCH = ", passwordMatches)
      if(bcrypt.compareSync(req.body.password, foundUser.password)){
        // console.log('JUST BEFORE LOGIN RESPONSE')
        req.session.message = '';
        //req.session.username = foundUser.username;
        req.session.logged = true;
        req.session.userId = foundUser._id
        res.json({
          status: 200,
          data: 'login successful',
          userId: foundUser._id
        });
      }else{
        req.session.message = 'email or password is not correct'
        res.status(401).json({
          status: 401,
          data: 'login unsuccessful'
        });
      }
    }else{
      req.session.message = 'email or password is incorrect';
      res.json({
        status: 401,
        data: 'login unsuccessful',
      });
    }
  }catch(err){
    res.send(err)
  }
})


//logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    }else{
      res.json({
        status: 200,
        data: 'logout successful'
      });
    }
  })
})

//edit User profile

router.get('/:id', async(req, res) => {
  try{
    const foundUser = await User.findById(req.params.id)
    res.json({
      status: 200,
      data: foundUser
    })
  }catch(err){
    res.send(err)
  }
})

router.put('/:id', async(req, res) => {
  try{
    console.log('req.body ===> ', req.body)
    let modifyProfile = {};
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    modifyProfile.password = hashedPassword;
    modifyProfile.username = req.body.username;
    modifyProfile.email = req.body.email;

    console.log("modifiy info ====>", modifyProfile)
    const updatedUser = await User.findByIdAndUpdate(req.params.id, modifyProfile, {new:true})
    console.log("findbyidandupdate info ===>", updatedUser)
    res.json({
      status: 200,
      data: 'user is updated',
      updatedUser: updatedUser
    })
  }catch(err){
    res.json(err)
  }
})



module.exports = router
