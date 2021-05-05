const express = require('express');
const router  = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const House  = require('../models/house');
const User = require('../models/user');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {fileSize: 100000000},
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('houseImg');

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

router.post('/', (req, res) => {
  upload(req, res,  async (err) => {
    if (err) {
      res.json(err);
    } else {
      const createdPost = await House.create(makeHouseFromBody(req.body, req.file.filename));
      createdPost.save((err, savedPost) => {
        res.json({
          msg: 'file uploaded',
          newPost: savedPost,
        });
      });
    };
  });
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
