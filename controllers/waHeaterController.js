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
    console.log('NO FILE?');
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
}).single('waheaterImg'); // name: 'picture' in form



function checkFileType(file, cb) { // checks file type,
  console.log('CHECKING FILE TYPE.');
  //allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);

  } else {
    cb('Error: Images only!');
  }
}



//*************** photo ****************


const Waheater  = require('../models/waheater');
const User = require('../models/user');


//get all roofs info
router.get('/', async(req, res) => {
  try{
    const allWaters = await Waheater.find();
    res.json({
      status: 200,
      data: allWaters
    })
  }catch(err){
      res.send(err)
  }

});

//get one roof by id
router.get('/:id', async(req, res) =>{
  try{
    const foundUser = await User.findById(req.params.id);
    const foundWaheater = await Waheater.findOne({userId: req.params.id});

    res.json({
      status: 200,
      data: foundWaheater,
    })


  }catch(err){
    console.log('house_one_get_err', err);
    res.send(err)
  }

});

//posting one roof
router.post('/', (req, res) => {

  upload(req, res,  async (err) => {
    if (err){
        console.log("route.post - error", err)
        res.json(err);
    }else{
        console.log('NOW CREATING');
        const createdPost = await Waheater.create({

          waheaterImg: `public/uploads/${req.file.filename}`,
        });
        createdPost.waheaterType = req.body.waheaterType;
        createdPost.waheaterBrand = req.body.waheaterBrand;
        createdPost.waheaterYear = req.body.waheaterYear;
        createdPost.waheaterCondition = req.body.waheaterCondition;
        createdPost.waheaterSingle = req.body.waheaterSingle;
        createdPost.userId = req.body.userId;


        createdPost.save((err, savedPost) => {
          res.json({
            msg: 'file uploaded',
            newPost: savedPost,
          });
        });
    }
  });
});



//one roof edit
router.put('/:id', async(req, res) => {
  try{
    const foundUser = await User.findById(req.params.id);
    const foundWaheater = await Waheater.findOne({userId: req.params.id})
    const updatedWaheater = await Waheater.findByIdAndUpdate(foundWater._id, req.body, {new: true});

    res.json({
      status: 200,
      data: updatedWaheater
    })
  }catch(err){
    res.send(err)
  }
});


//one roof delete
router.delete('/:id', async(req, res) => {
  try{
    const deletedWaheater = await Waheater.findByIdAndRemove(req.params.id);
    res.json({
      status: 200,
      data: deletedWaheater
    })

  }catch(err){
    res.send(err)
  }
});


module.exports = router
