const express = require('express');
const router  = express.Router();
//*************** photo ****************
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const URI = 'mongodb+srv://houseadmin:houseadmin1@cluster0-vjphq.mongodb.net/test?retryWrites=true&w=majority'


const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    console.log('what is file??', file);
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {fileSize: 100000000}, // 1 MB
  fileFilter: function (req, file, cb) {
    console.log('UPLOAD?');
    checkFileType(file, cb)
  }
}).single('houseImg'); // name: 'picture' in form
// }).array('photo', 4); // name: 'picture' in form


function checkFileType(file, cb) { // checks file type,

  //allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    console.log('checking');
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}



//*************** photo ****************


const House  = require('../models/house');
const User = require('../models/user');


//house detail list
router.get('/', async(req, res) => {
  try{
    const allhouses = await House.find();
    res.json({
      status: 200,
      data: allhouses
    })
  }catch(err){
      res.send(err)
  }

});

//one house details
router.get('/:id', async(req, res) =>{
  try{
    const foundUser = await User.findById(req.params.id);
    const foundHouse = await House.findOne({userId: req.params.id});

    res.json({
      status: 200,
      data: foundHouse,
    })


  }catch(err){
    console.log('house_one_get_err', err);
    res.send(err)
  }

});

router.post('/', (req, res) => {

  upload(req, res,  async (err) => {
    if (err){
        console.log("route.post - error", err)
        res.json(err);
    }else{
        console.log('post-req.body', req.body);
        const createdPost = await House.create({
          houseImg: `public/uploads/${req.file.filename}`,
        });
        //myCasa 01
        createdPost.address = req.body.address;
        createdPost.city = req.body.city;
        createdPost.state = req.body.state;
        createdPost.zipcode = req.body.zipcode;
        createdPost.houseYear = req.body.houseYear;
        createdPost.houseSqft = req.body.houseSqft;
        // createdPost.ceilingHeight = req.body.ceilingHeight;
        // createdPost.numOfRooms = req.body.numOfRooms;
        // createdPost.numOfStories = req.body.numOfStories;
        // createdPost.dirOfHouse = req.body.dirOfHouse;

        createdPost.userId = req.body.userId;
        // createdPost.username = req.body.username;
        createdPost.postingTime = req.body.postingTime;

        createdPost.save((err, savedPost) => {
          res.json({
            msg: 'file uploaded',
            newPost: savedPost,
          });
        });
    }
  });
});




//house edit

router.put('/:id', (req, res) => {
  console.log('--', req.body);
upload(req, res, async(err) =>{
  if(err){
    console.log('its err', err);
  }else{
    console.log('foundhouse', req.body);
    const foundUser = await User.findById(req.params.id);
    const foundHouse = await House.findOne({userId: req.params.id})

    const updatedHouse = await House.findByIdAndUpdate(foundHouse._id, req.body, {new: true});
    // const newhouseImg= `public/uploads/${req.file.filename}`
    // const updatedHouseImg = await House.findByIdAndUpdate(foundHouse._id, newhouseImg, {new:true});

    res.json({
      status: 200,
      data: updatedHouse
        })

  }

  })



});






// router.put('/:id', async(req, res) => {
//   try{
//     const foundUser = await User.findById(req.params.id);
//     const foundHouse = await House.findOne({userId: req.params.id})
//     console.log('foundhouse', req.body);
//     const updatedHouse = await House.findByIdAndUpdate(foundHouse._id, req.body, {new: true});
//     res.json({
//       status: 200,
//       data: updatedHouse
//     })
//   }catch(err){
//     res.send(err)
//   }
// });


//house delete
router.delete('/:id', async(req, res) => {
  try{
    const deletedHouse = await House.findByIdAndRemove(req.params.id);
    res.json({
      status: 200,
      data: deletedHouse
    })

  }catch(err){
    res.send(err)
  }
});


module.exports = router
