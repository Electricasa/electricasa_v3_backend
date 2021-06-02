const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Utility  = require('../models/utility');
const User = require('../models/user');

const photoUtil = require('../utils/photoUploadService');

// const URI = `mongodb+srv://seheesf88:casa-north@cluster0.4c1d1.mongodb.net/electricasa-v3?retryWrites=true&w=majority`

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
    const allUtilities = await Utility.find();
    res.json({
      status: 200,
      data: allUtilities
    })
  } catch(err) {
    res.send(err);
  }
});

router.get('/:id', async(req, res) =>{
  try{
    // const foundUser = await User.findById(req.params.id);
    const foundUtility = await Utility.findOne({userId: req.params.id});
    res.json({
      status: 200,
      data: foundUtility
    });
  }catch(err){
    res.send(err)
  };
});

router.post('/', upload.single('utilityImg'), (req, res) => {
  photoUtil.uploadPhotoSaveFormInfo(req, res, Utility, 'utilityImg')
});

// router.post('/', (req, res) => {
//   upload(req, res,  async (err) => {
//     if (err){
//         res.json(err);
//     }else{
//         const createdPost = await Utility.create(makeUtilityFromBody(req.body, req.file.filename))
//         createdPost.save((err, savedPost) => {
//           res.json({
//             msg: 'file uploaded',
//             newPost: savedPost,
//           });
//         });
//     }
//   });
// });


function makeUtilityFromBody(body, filename){
  return {
      utilityImg: `public/uploads/${filename}`,
      utilityName: body.utilityName,
      electricityUsageKwh: body.electricityUsageKwh,
      electricityUsageDollar: body.electricityUsageDollar,
      gasUsageTherms: body.gasUsageTherms,
      gasUsageDollar: body.gasUsageDollar,
      highBilling: body.highBilling,
      oldEquipment: body.oldEquipment,
      userId: body.userId
  }
}

router.put('/:id', upload.single('utilityImg'), (req, res) => {
  
  photoUtil.uploadPhotoEditFormInfo(req, res, Utility, 'utilityImg')
});

router.put('/:id/noPhoto', (req, res) => {
  
  photoUtil.noPhotoEditFormInfo(req, res, Utility)
});

// router.put('/:id', (req, res) => {
//   upload(req, res, async(err) =>{
//     if(err){
//     }else{
//       const example = makeUtilityFromBody(req.body, req.file.filename);
//       const foundUtility = await Utility.findOne({userId: req.params.id});
//       const updatedUtility = await Utility.findByIdAndUpdate(foundUtility._id, example, {new: true});

//       res.json({
//         status: 200,
//         data: updatedUtility
//           })
//     }
//   })
// });

router.delete('/:id', async(req, res) => {
  try{
    const foundUtility = await Utility.findOne({userId: req.params.id});
    const deletedUtility = await Utility.findByIdAndRemove(foundUtility._id);
    res.json({
      status: 200,
      data: deletedUtility
    })

  }catch(err){
    res.send(err)
  }
});


module.exports = router
