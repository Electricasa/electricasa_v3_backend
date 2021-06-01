//Address
const AdminNote = require('../models/adminNote');
const Address = require('../models/address');


module.exports = {
  createAdminNote
}

async function createAdminNote(req, res) {
    
    
  
    // Address Model
    // links the adminNote to the address model so we can call
    // .populate on the requests for Admin side

    // Add to address Model
    
    try{
      const adminNote = new AdminNote({...req.body});
    //   adminNote.addressId = req.params.id;
    //   adminNote.date = new Date();
      await adminNote.save();
      
      console.log(adminNote, "adminNote created")
      
      
      res.json({ adminNote });
    } catch (err) {
      console.log("something went wrong")
      // duplicate email, most likely
      res.status(400).json(err);
    }
  
  }