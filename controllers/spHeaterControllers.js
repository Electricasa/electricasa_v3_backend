const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const SpHeater  = require('../models/spHeater');
const User = require('../models/user');
const URI = `mongodb+srv://seheesf88:casa-north@cluster0.4c1d1.mongodb.net/electricasa-v3?retryWrites=true&w=majority`;

const photoUtil = require('../utils/photoUploadService')

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  // storage: storage,
  limits: {fileSize: 100000000},
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

router.get('/', async(req, res) => {
  try{
    const allSpHeater = await SpHeater.find();
    res.json({
      status: 200,
      data: allSpHeater
    })
  }catch(err){
    res.send(err);
  }
});

router.get('/:id', async(req, res) =>{
  try{
    // const foundUser = await User.findById(req.params.id);
    const foundSpHeater = await SpHeater.findOne({userId: req.params.id});
    res.json({
      status: 200,
      data: foundSpHeater
    });
  }catch(err){
    res.send(err);
  }
});

router.post('/', upload.single('spHeaterImg'), (req, res) => {
  photoUtil.uploadPhotoSaveFormInfo(req, res, SpHeater, 'spHeaterImg')
});

// router.post('/', (req, res) => {
//   upload(req, res,  async (err) => {
//     if (err){
//       res.json(err);
//     }else{
//       const createdPost = await SpHeater.create(makeSpHeaterFromBody(req.body, req.file.filename));
//       createdPost.save((err, savedPost) => {
//         res.json({
//           msg: 'file uploaded',
//           newPost: savedPost
//         });
//       });
//     };
//   });
// });

function makeSpHeaterFromBody(body, filename){
  return {
      spHeaterImg: `public/uploads/${filename}`,
      spHeaterType: body.spHeaterType,
      spHeaterBrand: body.spHeaterBrand,
      spHeaterYear: body.spHeaterYear,
      spHeaterCondition: body.spHeaterCondition,
      coolingSystem: body.coolingSystem,
      userId: body.userId
  };
};

router.put('/:id', upload.single('spHeaterImg'), (req, res) => {
  
  photoUtil.uploadPhotoEditFormInfo(req, res, SpHeater, 'spHeaterImg')
});


router.put('/:id', (req, res) => {
  upload(req, res, async(err) =>{
    if(err){
      console.log('its err', err);
    }else{
      const example = makeSpHeaterFromBody(req.body, req.file.filename);
      const foundSpHeater = await SpHeater.findOne({userId: req.params.id});
      const updatedSpHeater = await SpHeater.findByIdAndUpdate(foundSpHeater._id, example, {new: true});

      res.json({
        status: 200,
        data: updatedSpHeater
      });
    };
  });
});

router.delete('/:id', async(req, res) => {
  try{
    const foundSpHeater = await SpHeater.findOne({userId: req.params.id});
    const deletedSpHeater = await SpHeater.findByIdAndRemove(foundSpHeater._id);
    res.json({
      status: 200,
      data: deletedSpHeater
    })
  }catch(err){
    res.send(err)
  };
});

module.exports = router
