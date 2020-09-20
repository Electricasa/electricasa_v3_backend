const express = require('express');
const router  = express.Router();

const User        = require('../models/user');
const House       = require('../models/house');
const Attic       = require('../models/attic');
const Roof        = require('../models/roof');
const SpHeater    = require('../models/spHeater');
const WaHeater    = require('../models/waHeater');
const Utility     = require('../models/utility');

//get my acc
// router.get('/:id', async(req, res) => {
//   try{
//     const foundUser = await User.findById(req.params.id)
//     res.json({
//       status: 200,
//       data: foundUser
//
//     })
//   }catch(err){
//     res.send(err)
//   }
// })

router.get('/:id', async(req, res) => {
  try{
    const foundUser = await User.findById(req.params.id)
    const foundHouse = await House.findOne({'house._id': req.params.id})
    const foundAttic = await Attic.findOne({'attic._id': req.params.id})
    const foundRoof = await Roof.findOne({'roof._id': req.params.id})
    const foundWaHeater = await SpHeater.findOne({'spHeater._id': req.params.id})
    const foundSpHeater = await WaHeater.findOne({'waHeater._id': req.params.id})
    const foundUtility = await Utility.findOne({'utility._id': req.params.id})

    res.json({
      status: 200,
      user: foundUser,
      house: foundHouse,
      attic: foundAttic,
      roof: foundRoof,
      waHeater: foundWaHeater,
      spHeater: foundSpHeater,
      utility: foundUtility
    })
  }catch(err){
    console.log("Get user request err - ", err)
    res.send(err)
  }
})


//delete my acc
router.delete('/:id', async(req, res) => {
  try{
    const deletedUser = await User.findByIdAndRemove(req.params.id);
    res.json({
      status: 200,
      data: deletedUser
    })
  }catch(err){
    res.send(err)
  }
})



module.exports = router
