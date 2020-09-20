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
}).single('spHeaterImg'); // name: 'picture' in form



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


const SpHeater  = require('../models/spheater');
const User = require('../models/user');


router.get('/', async(req, res) => {
  try{
    const allSpaces = await SpHeater.find();
    res.json({
      status: 200,
      data: allSpaces
    })
  }catch(err){
      res.send(err)
  }

});


router.get('/:id', async(req, res) =>{
  try{
    const foundUser = await User.findById(req.params.id);
    const foundSpace = await SpHeater.findOne({userId: req.params.id});

    res.json({
      status: 200,
      data: foundSpace,
    })


  }catch(err){
    console.log('house_one_get_err', err);
    res.send(err)
  }

});


router.post('/', (req, res) => {

  upload(req, res,  async (err) => {
    if (err){
        // console.log("route.post - error", err)
        res.json(err);
    }else{
        // console.log('NOW CREATING');
        const createdPost = await SpHeater.create({

          spHeaterImg : `public/uploads/${req.file.filename}`,
        });

        // createdPost.exterior = req.body.exterior;
        createdPost.spHeaterType = req.body.spHeaterType;
        createdPost.atticSqft = req.body.atticSqft;
        createdPost.spHeaterYear = req.body.spHeaterYear;
        createdPost.spHeaterCondition = req.body.spHeaterCondition;
        createdPost.coolingSystem = req.body.coolingSystem;
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



//one space heater edit
router.put('/:id', async(req, res) => {
  try{
    const foundUser = await User.findById(req.params.id);
    const foundSpace = await SpHeater.findOne({userId: req.params.id})
    const updatedSpace = await SpHeater.findByIdAndUpdate(foundSpace._id, req.body, {new: true});

    res.json({
      status: 200,
      data: updatedSpace
    })
  }catch(err){
    res.send(err)
  }
});


//one space heater delete
router.delete('/:id', async(req, res) => {
  try{
    const deletedSpace = await SpHeater.findByIdAndRemove(req.params.id);
    res.json({
      status: 200,
      data: deletedSpace
    })

  }catch(err){
    res.send(err)
  }
});


module.exports = router
