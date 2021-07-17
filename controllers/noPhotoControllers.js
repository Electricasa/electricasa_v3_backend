const express = require('express');
const router  = express.Router();

const Attic  = require('../models/attic');
const House  = require('../models/house');
const Roof  = require('../models/roof');
const SpHeater  = require('../models/spHeater');
const Utility  = require('../models/utility');
const User = require('../models/user');
const WaHeater  = require('../models/waHeater');

const photoUtil = require('../utils/photoUploadService');



// attic
router.put('/attic/:id', (req, res) => {
  
    photoUtil.noPhotoEditFormInfo(req, res, Attic)
  });

// house
router.put('/house/:id', (req, res) => {
  
    photoUtil.noPhotoEditFormInfo(req, res, House)
  });

// roof
router.put('/roof/:id', (req, res) => {
  
    photoUtil.noPhotoEditFormInfo(req, res, Roof)
  });

// spHeater
router.put('/spHeater/:id', (req, res) => {
  
    photoUtil.noPhotoEditFormInfo(req, res, SpHeater)
  });

// utility
router.put('/utility/:id', (req, res) => {
  
    photoUtil.noPhotoEditFormInfo(req, res, Utility)
  });

//waHeater
router.put('/waHeater/:id', (req, res) => {
  
    photoUtil.noPhotoEditFormInfo(req, res, WaHeater)
  });






module.exports = router
