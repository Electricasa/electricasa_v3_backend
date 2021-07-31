const multer = require('multer');
const path = require('path');
const Address  = require('../models/address');
const addressUtil = require ('./addressService');
//creates a uniform id for S3 storage
const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(); // initialize the construcotr

const multerUpload = multer({
  // storage: storage,
  limits: {fileSize: 100000000},
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype, "blob mimetype <-----");
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


function uploadPhotoSaveFormInfo(req, res, ModelObject, photoName) {
    
    console.log(req.file, "req.file<------")
    const filePath = `${uuidv4()}/${req.file.originalname}`
    const params = {Bucket: 'myelectricasa', Key: filePath, Body: req.file.buffer};
   
    s3.upload(params, async function(err, data){

      // get our mycasa document and the document for the address as a whole
      const newModelDocument = await ModelObject.create({...req.body});
      const addressDocument = await Address.findOne({user: req.body.userId});

      // model field is the same as the Image field minus "Img"
      const modelField = photoName.slice(0, (photoName.length - 3));
      addressDocument[modelField] = newModelDocument._id;

      // check if address document is complete or not, update address doc's complete field
      addressDocument.completed = addressUtil.checkComplete(addressDocument);

      addressDocument.verified = addressDocument.verified ? addressDocument.verified : false;

      // test updated documents
      console.log(newModelDocument, "database record being saved to db in S3 function")
      console.log(addressDocument, "Address doc from S3 function <--------")

      // data.Location is our photoUrl that exists on aws
      newModelDocument[photoName] = data.Location;
      try {
        newModelDocument.save();
        addressDocument.save();
        res.json({ status: 200 });
      } catch (err) {
        // House not created successfully.
        res.status(500).json(err);
      }
    })
  
  };


  function uploadPhotoEditFormInfo(req, res, ModelObject, photoName) {


    if(!req.file){

     return res.status(500).json(err);

    } else{

      console.log(req.file, "req.file<------")
    const filePath = `${uuidv4()}/${req.file.originalname}`
    const params = {Bucket: 'myelectricasa', Key: filePath, Body: req.file.buffer};
   
    s3.upload(params, async function(err, data){

      // get our mycasa document and the document for the address as a whole
      // const newModelDocument = await ModelObject.create({...req.body});
      const addressDocument = await Address.findOne({user: req.body.userId});

      const modelDocumentToEdit = await ModelObject.findOne({userId: req.params.id});

      if(modelDocumentToEdit){
        for (const key in req.body) {
          modelDocumentToEdit[key] = req.body[key];
      }
    }

      // const updatedHouse = await House.findByIdAndUpdate(foundHouse._id, example, {new: true});

      // model field is the same as the Image field minus "Img"
      const modelField = photoName.slice(0, (photoName.length - 3));
      // addressDocument[modelField] = newModelDocument._id;

      // check if address document is complete or not, update address doc's complete field
      addressDocument.completed = addressUtil.checkComplete(addressDocument);

      addressDocument.verified = addressDocument.verified ? addressDocument.verified : false;

      // test updated documents
      console.log(modelDocumentToEdit, "database record being saved to db in S3 function")
      console.log(addressDocument, "Address doc from S3 function <--------")

      // data.Location is our photoUrl that exists on aws
      modelDocumentToEdit[photoName] = data.Location;
      try {
        modelDocumentToEdit.save();
        addressDocument.save();
        res.json({ status: 200 });
      } catch (err) {
        // House not created successfully.
        res.status(500).json(err);
      }
    })

    }
  
  };


  async function noPhotoEditFormInfo(req, res, ModelObject){
    console.log(req.body, "req.body <----- editNoPhoto")
    const addressDocument = await Address.findOne({user: req.params.id});

      const modelDocumentToEdit = await ModelObject.findOne({userId: req.params.id});



      if(modelDocumentToEdit){
        for (const key in req.body) {
          modelDocumentToEdit[key] = req.body[key];
      }
    } else {
      console.log('No Model Object');
    }
    if(!addressDocument){
      console.log('No address doc......');
    } else {

      addressDocument.completed = addressUtil.checkComplete(addressDocument);

      addressDocument.verified = addressDocument.verified ? addressDocument.verified : false;

      // test updated documents
    console.log(modelDocumentToEdit, "database record being saved to db in No Photo Edit function")
    console.log(addressDocument, "Address doc from No Photo Edit function <--------")

    }
    
    try {
      modelDocumentToEdit.save();
      addressDocument.save();
      res.json({ status: 200 });
    } catch (err) {
      // House not created successfully.
      res.status(500).json(err);
    }

  }

  module.exports = {
      multerUpload,
      uploadPhotoSaveFormInfo,
      uploadPhotoEditFormInfo,
      noPhotoEditFormInfo
  }