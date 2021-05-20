const multer = require('multer');
const path = require('path');
const Address  = require('../models/address');

//creates a uniform id for S3 storage
const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(); // initialize the construcotr

// get the appropriate field in the address model to 
// correspond with the right model from the controller funciton




// Function for updating the address
  //save the particular model



function uploadPhotoSaveFormInfo(req, res, ModelObject, photoName) {
    
    console.log(req.file, "req.file<------")
    const filePath = `${uuidv4()}/${req.file.originalname}`
    const params = {Bucket: 'myelectricasa', Key: filePath, Body: req.file.buffer};
   
    s3.upload(params, async function(err, data){

      console.log(req.body, "<--------req.body from s3")
      // data.Location is our photoUrl that exists on aws
      const newModelDocument = await ModelObject.create({...req.body});
      const addressDocument = await Address.findOne({userId: req.body.userId});
      console.log(addressDocument, "address Doc from S3")
      const modelField = photoName.slice(0, (photoName.length - 3));
      console.log(modelField, "Model Field <--------")
      addressDocument[modelField] = newModelDocument._id;
      console.log(newModelDocument, "database record being saved to db in S3 function")
      console.log(addressDocument, "Address doc from S3 function <--------")
      newModelDocument[photoName] = data.Location;
      try {
        newModelDocument.save();
        addressDocument.save();
      } catch (err) {
        // House not created successfully.
        res.status(500).json(err);
      }
    })
  
  };

  module.exports = {
      uploadPhotoSaveFormInfo
  }