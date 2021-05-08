const multer = require('multer');
const path = require('path');

//creates a uniform id for S3 storage
const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(); // initialize the construcotr

function uploadPhotoSaveFormInfo(req, res, ModelObject, photoName) {

    console.log(req.file, "req.file<------")
    const filePath = `${uuidv4()}/${req.file.originalname}`
    const params = {Bucket: 'myelectricasa', Key: filePath, Body: req.file.buffer};
   
    s3.upload(params, async function(err, data){
      // data.Location is our photoUrl that exists on aws
      const newModelInstance = await ModelObject.create({...req.body});
      newModelInstance[photoName] = data.Location;
      try {
        newModelInstance.save();
      } catch (err) {
        // House not created successfully.
        res.status(500).json(err);
      }
    })
  
  };

  module.exports = {
      uploadPhotoSaveFormInfo
  }