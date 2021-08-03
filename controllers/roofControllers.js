const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Roof  = require('../models/roof');
const User = require('../models/user');

const photoUtil = require('../utils/photoUploadService')


router.get('/', async(req, res) => {
  try {
    const allRoofs = await Roof.find();
    res.json({
      status: 200,
      data: allRoofs
    })
  } catch(err) {
    res.send(err);
  };
});

router.get('/:id', async(req, res) =>{
  try {
    // const foundUser = await User.findById(req.params.id);
    const foundRoof = await Roof.findOne({userId: req.params.id});
    res.json({
      status: 200,
      data: foundRoof,
    });
  } catch(err) {
    res.send(err)
  };
});

router.post('/', photoUtil.multerUpload.single('roofImg'), (req, res) => {
  photoUtil.uploadPhotoSaveFormInfo(req, res, Roof, 'roofImg')
});


// function makeRoofFromBody(body, filename){
//   return {
//     roofImg: `public/uploads/${filename}`,
//     exterior: body.exterior,
//     roofColor: body.roofColor,
//     pvSystem: body.pvSystem,
//     panels: body.panels,
//     dcCapacity: body.dcCapacity,
//     userId: body.userId
//   };
// };

router.put('/noPhoto/:id', (req, res) => {
  
  photoUtil.noPhotoEditFormInfo(req, res, Roof)
});

router.put('/:id', photoUtil.multerUpload.single('roofImg'), (req, res) => {

  photoUtil.uploadPhotoEditFormInfo(req, res, Roof, 'roofImg')
});



router.delete('/:id', async(req, res) => {
  try {
    const foundRoof = await Roof.findOne({userId: req.params.id});
    const deletedRoof = await Roof.findByIdAndRemove(foundRoof._id);
    res.json({
      status: 200,
      data: deletedRoof
    });
  } catch(err) {
    res.send(err)
  };
});

module.exports = router
