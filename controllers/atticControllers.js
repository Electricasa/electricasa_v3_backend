const express = require('express');
const router  = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Attic  = require('../models/attic');
const User = require('../models/user');

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
  try {
    const allAttic = await Attic.find();

    res.json({
      status: 200,
      data: allAttic
    });
  } catch(err) {
    res.send(err)
  };
});

router.get('/:id', async(req, res) =>{
  try {
    const foundUser = await User.findById(req.params.id);
    const foundAttic = await Attic.findOne({userId: req.params.id});

    res.json({
      status: 200,
      data: foundAttic,
    });
  } catch(err) {
    console.log('attic get request - ', err);
    res.send(err);
  };
});

router.post('/', upload.single('atticImg'), (req, res) => {
  photoUtil.uploadPhotoSaveFormInfo(req, res, Attic, 'atticImg')
});

// router.post('/', (req, res) => {
//   upload(req, res,  async (err) => {
//     if (err){
//       res.json(err);
//     }else{
//       const createdPost = await Attic.create(makeAtticFromBody(req.body, req.file.filename));
//       createdPost.save((err, savedPost) => {
//         res.json({
//           msg: 'file uploaded',
//           newPost: savedPost,
//         });
//       });
//     };
//   });
// });

function makeAtticFromBody(body, filename){
  return {
    atticImg: `public/uploads/${filename}`,
    atticType: body.atticType,
    atticSqft: body.atticSqft,
    atticDepth: body.atticDepth,
    insulMaterial: body.insulMaterial,
    airSealed: body.airSealed,
    userId: body.userId
  }
};

router.put('/:id', upload.single('atticImg'), (req, res) => {
  photoUtil.uploadPhotoEditFormInfo(req, res, Attic, 'atticImg')
});

router.put('/:id/noPhoto', (req, res) => {
  
  photoUtil.noPhotoEditFormInfo(req, res, Attic)
});

// router.put('/:id', (req, res) => {
//   upload(req, res, async(err) =>{
//     if (err) {
//       console.log('its err', err);
//     } else {
//       const example = makeAtticFromBody(req.body, req.file.filename);
//       const foundAttic = await Attic.findOne({userId: req.params.id});
//       const updatedAttic = await Attic.findByIdAndUpdate(foundAttic._id, example, {new: true});

//       res.json({
//         status: 200,
//         data: updatedAttic
//       });
//     };
//   });
// });

router.delete('/:id', async(req, res) => {
  try {
    console.log(req.params.id, "attic delete firing");
    const foundAttic = await Attic.findOne({userId: req.params.id});
    console.log(foundAttic, "found Attic from delete");
    const deletedAttic = await Attic.findByIdAndRemove(foundAttic._id);

    res.json({
      status: 200,
      data: deletedAttic
    });
  } catch(err) {
    res.send(err);
  }
});

module.exports = router
