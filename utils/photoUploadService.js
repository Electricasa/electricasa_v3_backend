const multer = require('multer');
const path = require('path');
const Address  = require('../models/address');

//creates a uniform id for S3 storage
const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(); // initialize the construcotr



function uploadPhotoSaveFormInfo(req, res, ModelObject, photoName) {
    
    console.log(req.file, "req.file<------")
    const filePath = `${uuidv4()}/${req.file.originalname}`
    const params = {Bucket: 'myelectricasa', Key: filePath, Body: req.file.buffer};
   
    s3.upload(params, async function(err, data){

      // get our mycasa document and the document for the address as a whole
      const newModelDocument = await ModelObject.create({...req.body});
      const addressDocument = await Address.findOne({userId: req.body.userId});

      // model field is the same as the Image field minus "Img"
      const modelField = photoName.slice(0, (photoName.length - 3));
      addressDocument[modelField] = newModelDocument._id;

      // check if address document is complete or not

      // complete, update address doc's complete field to true

      // test updated documents
      console.log(newModelDocument, "database record being saved to db in S3 function")
      console.log(addressDocument, "Address doc from S3 function <--------")

      // data.Location is our photoUrl that exists on aws
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