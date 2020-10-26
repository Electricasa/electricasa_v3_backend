const express = require('express');
const router  = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const WaHeater  = require('../models/waHeater');
const User = require('../models/user');

// const URI = `mongodb+srv://seheesf88:casa-north@cluster0.4c1d1.mongodb.net/electricasa-v3?retryWrites=true&w=majority`

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
    console.log('UPLOAD?');
    checkFileType(file, cb)
  }
}).single('waHeaterImg');


function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    console.log('checking');
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}


router.get('/', async(req, res) => {
  try{
    const allWaHeater = await WaHeater.find();
    res.json({
      status: 200,
      data: allWaHeater
    })
  }catch(err){
      res.send(err)
  }

});

router.get('/:id', async(req, res) =>{
  try{
    // const foundUser = await User.findById(req.params.id);
    const foundWaHeater = await WaHeater.findOne({userId: req.params.id});
    res.json({
      status: 200,
      data: foundWaHeater,
    })


  }catch(err){
    res.send(err)
  }

});

router.post('/', (req, res) => {
  upload(req, res,  async (err) => {
    if (err){
        res.json(err);
    }else{
        const createdPost = await WaHeater.create(makeWaHeaterFromBody(req.body, req.file.filename))
        createdPost.save((err, savedPost) => {
          res.json({
            msg: 'file uploaded',
            newPost: savedPost,
          });
        });
    }
  });
});


function makeWaHeaterFromBody(body, filename){
  return {
      waHeaterImg: `public/uploads/${filename}`,
      waHeatertype: body.waHeatertype,
      waHeaterBrand: body.waHeaterBrand,
      waHeaterYear: body.waHeaterYear,
      waHeaterCondition: body.waHeaterCondition,
      waHeaterSingle: body.waHeaterSingle,
      userId: body.userId
  }
}

router.put('/:id', (req, res) => {
  upload(req, res, async(err) =>{
    if(err){
      console.log('its err', err);
    }else{
      const example = makeWaHeaterFromBody(req.body, req.file.filename);
      const foundWaHeater = await WaHeater.findOne({userId: req.params.id});
      const updatedWaHeater = await WaHeater.findByIdAndUpdate(foundWaHeater._id, example, {new: true});

      res.json({
        status: 200,
        data: updatedWaHeater
          })
    }
  })
});

router.delete('/:id', async(req, res) => {
  try{
    const foundWaHeater = await WaHeater.findOne({userId: req.params.id});
    const deletedWaHeater = await WaHeater.findByIdAndRemove(foundWaHeater._id);
    res.json({
      status: 200,
      data: deletedWaHeater
    })

  }catch(err){
    res.send(err)
  }
});


module.exports = router
