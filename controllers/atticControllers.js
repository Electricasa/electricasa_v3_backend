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
}).single('atticImg'); // name: 'picture' in form



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


const Attic  = require('../models/attic');
const User = require('../models/user');


//get all attics info
router.get('/', async(req, res) => {
  try{
    const allattics = await Attic.find();
    res.json({
      status: 200,
      data: allattics
    })
  }catch(err){
      res.send(err)
  }

});

//get one attic by id
router.get('/:id', async(req, res) =>{
  try{
    const foundUser = await User.findById(req.params.id);
    const foundattic = await Attic.findOne({userId: req.params.id});

    res.json({
      status: 200,
      data: foundattic,
    })


  }catch(err){
    console.log('house_one_get_err', err);
    res.send(err)
  }

});

//posting one attic
router.post('/', (req, res) => {

  upload(req, res,  async (err) => {
    if (err){
        console.log("route.post - error", err)
        res.json(err);
    }else{
        const createdPost = await Attic.create({

          atticImg: `public/uploads/${req.file.filename}`,
        });
        console.log('jiji');
        // createdPost.exterior = req.body.exterior;
        // createdPost.roofConstruction = req.body.roofConstruction;
        createdPost.atticType = req.body.atticType;
        createdPost.atticSqft = req.body.atticSqft;
        createdPost.atticDepth = req.body.atticDepth;
        createdPost.insulMaterial = req.body.insulMaterial;
        createdPost.airSealed = req.body.airSealed;
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



//one attic edit
router.put('/:id', async(req, res) => {
  try{
    const foundUser = await User.findById(req.params.id);
    const foundattic = await Attic.findOne({userId: req.params.id})
    const updatedattic = await Attic.findByIdAndUpdate(foundattic._id, req.body, {new: true});

    res.json({
      status: 200,
      data: updatedattic
    })
  }catch(err){
    res.send(err)
  }
});


//one attic delete
router.delete('/:id', async(req, res) => {
  try{
    const deletedattic = await Attic.findByIdAndRemove(req.params.id);
    res.json({
      status: 200,
      data: deletedattic
    })

  }catch(err){
    res.send(err)
  }
});


module.exports = router
