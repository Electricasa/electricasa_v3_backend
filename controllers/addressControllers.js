
//Address
const Address = require('../models/address');


module.exports = {
  getAllAddresses
}
//posts = await PlantPost.find({}).sort({'_id': -1}).populate('user').populate('plant').exec() // userSchema.set('toObject') gets invoked, to delete the password
async function getAllAddresses(req, res){
    const allAddresses = await Address.find({}).sort({'._id': -1}).populate('user').populate('attic').populate('house')
                    .populate('roof').populate('spHeater').populate('utility').populate('waHeater').exec();
    res.json({allAddresses});
}