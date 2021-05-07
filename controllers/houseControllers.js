const express = require('express');
const router  = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

//creates a uniform id for S3 storage
const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(); // initialize the construcotr

const House  = require('../models/house');
const User = require('../models/user');

// houseImg  is the key for the image file

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


// removing .single('houseImg') to add in the middleware for readability
const upload = multer({
  // storage: storage,
  limits: {fileSize: 100000000},
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// const upload = multer();

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  };
};

router.get('/', async(req, res) => {
  try {
    const allhouses = await House.find();
    res.json({
      status: 200,
      data: allhouses
    });
  } catch(err) {
    res.send(err);
  };
});

router.get('/:id', async(req, res) =>{
  try {
    const foundUser = await User.findById(req.params.id);
    const foundHouse = await House.findOne({userId: req.params.id});
    res.json({
      status: 200,
      data: foundHouse,
    });
  } catch(err) {
    res.send(err);
  };
});

// upload.single should create req.file that has the 
// originalname and buffer attributes

router.post('/', upload.single('houseImg'), (req, res) => {
  // upload(req, res,  async (err) => {
  //   if (err) {
  //     res.json(err);
  //   } else {
  //     const createdPost = await House.create(makeHouseFromBody(req.body, req.file.filename));
  //     createdPost.save((err, savedPost) => {
  //       res.json({
  //         msg: 'file uploaded',
  //         newPost: savedPost,
  //       });
  //     });
  //   };
  // });
  console.log(req.file, "req.file<------")
  const filePath = `${uuidv4()}/${req.file.originalname}`
  const params = {Bucket: 'myelectricasa', Key: filePath, Body: req.file.buffer};
 
  s3.upload(params, async function(err, data){
    // data.Location is our photoUrl that exists on aws
    
    try {
      const house = await House.create({...req.body, houseImg: data.Location});
    } catch (err) {
      // House not created successfully.
      res.status(500).json(err);
    }
  })

});

function makeHouseFromBody(body, filename) {
  return {
      houseImg: `public/uploads/${filename}`,
      address: body.address,
      city: body.city,
      state: body.state,
      zipcode: body.zipcode,
      houseYear: body.houseYear,
      houseSqft: body.houseSqft,
      userId: body.userId
  }
};

router.put('/:id', (req, res) => {
  upload(req, res, async(err) =>{
    if (err) {
      console.log('its err', err);
    } else {
      const example = makeHouseFromBody(req.body, req.file.filename);
      const foundHouse = await House.findOne({userId: req.params.id});
      const updatedHouse = await House.findByIdAndUpdate(foundHouse._id, example, {new: true});

      res.json({
        status: 200,
        data: updatedHouse
      });
    };
  });
});

router.delete('/:id', async(req, res) => {
  try {
    const foundHouse = await House.findOne({userId: req.params.id});
    const deletedHouse = await House.findByIdAndRemove(foundHouse._id);

    res.json({
      status: 200,
      data: deletedHouse
    });
  } catch(err) {
    res.send(err);
  };
});

module.exports = router
