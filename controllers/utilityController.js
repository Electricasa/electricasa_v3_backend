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
}).single('utilityImg'); // name: 'picture' in form



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


const Utility  = require('../models/utility');
const User = require('../models/user');


//get all roofs info
router.get('/', async(req, res) => {
  try{
    const allUtility = await Utility.find();
    res.json({
      status: 200,
      data: allUtility
    })
  }catch(err){
      res.send(err)
  }

});

//get one roof by id
router.get('/:id', async(req, res) =>{
  try{
    const foundUser = await User.findById(req.params.id);
    const foundUtility = await Utility.findOne({userId: req.params.id});

    res.json({
      status: 200,
      data: foundUtility,
    })


  }catch(err){
    console.log('get one utility err', err);
    res.send(err)
  }

});

//posting one utility
router.post('/', (req, res) => {

  upload(req, res,  async (err) => {
    if (err){
        console.log("route.post - error", err)
        res.json(err);
    }else{
        console.log('NOW CREATING');
        const createdPost = await Utility.create({

          utilityImg: `public/uploads/${req.file.filename}`,
        });
        createdPost.utilityName = req.body.utilityName;
        createdPost.electricityUsageKwh = req.body.electricityUsageKwh;
        createdPost.electricityUsageDollar = req.body.electricityUsageDollar;
        createdPost.gasUsageTherms = req.body.gasUsageTherms;
        createdPost.gasUsageDollar = req.body.gasUsageDollar;
        createdPost.highBilling = req.body.highBilling;
        createdPost.oldEquipment = req.body.oldEquipment;
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



//one utiltiy edit
router.put('/:id', async(req, res) => {
  console.log(req.body);
  try{
    const foundUser = await User.findById(req.params.id);
    const foundUtility = await Utility.findOne({userId: req.params.id})
    const updatedUtility = await Utility.findByIdAndUpdate(foundUtility._id, req.body, {new: true});

    res.json({
      status: 200,
      data: updatedUtility
    })
  }catch(err){
    res.send(err)
  }
});


//one roof delete
router.delete('/:id', async(req, res) => {
  try{
    const deletedUtility = await Utility.findByIdAndRemove(req.params.id);
    res.json({
      status: 200,
      data: deletedUtility
    })

  }catch(err){
    res.send(err)
  }
});


module.exports = router
