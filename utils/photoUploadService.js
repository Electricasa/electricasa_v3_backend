const multer = require('multer');
const path = require('path');
const Address  = require('../models/address');

//creates a uniform id for S3 storage
const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(); // initialize the construcotr

// get the appropriate field in the address model to 
// correspond with the right model from the controller funciton
function getAddressField(ModelObject){
  ModelObject[0] = ModelObject[0].toLowerCase();
  return ModelObject;
}



// Function for updating the address
  //save the particular model



function uploadPhotoSaveFormInfo(req, res, ModelObject, photoName) {
    
    console.log(req.file, "req.file<------")
    const filePath = `${uuidv4()}/${req.file.originalname}`
    const params = {Bucket: 'myelectricasa', Key: filePath, Body: req.file.buffer};
   
    s3.upload(params, async function(err, data){
      // data.Location is our photoUrl that exists on aws
      const newModelDocument = await ModelObject.create({...req.body});
      const addressDocument = await Address.findOne({userId: req.body.userId});
      const addressField = getAddressField(ModelObject);
      addressDocument[addressField] = newModelDocument._id;
      console.log(newModelDocument, "database record being saved to db in S3 function")
      newModelDocument[photoName] = data.Location;
      try {
        newModelDocument.save();
      } catch (err) {
        // House not created successfully.
        res.status(500).json(err);
      }
    })
  
  };

  module.exports = {
      uploadPhotoSaveFormInfo
  }