
//Address
const Address = require('../models/address');


module.exports = {
  getAllAddresses,
  getOneAddress
}
//posts = await PlantPost.find({}).sort({'_id': -1}).populate('user').populate('plant').exec() // userSchema.set('toObject') gets invoked, to delete the password
async function getAllAddresses(req, res){
    try{
        const allAddresses = await Address.find({}).sort({'_id': -1}).populate('user').populate('attic').populate('house')
                    .populate('roof').populate('spHeater').populate('utility')
                    .populate('waHeater').exec();
        res.status(200).json({allAddresses});
    } catch(err){
        return res.status(401).json(err)
    }
    
}

async function getOneAddress(req, res){
    
    try{
        console.log(req.params.id, "<----- backend get one address firing")
        const address = await Address.findOne({_id: req.params.id}).populate('user').populate('attic').populate('house')
            .populate('roof').populate('spHeater').populate('utility')
            .populate('waHeater').exec();
        console.log(address.house, "address from getOne BE <------")
        res.status(200).json({address});
    } catch(err){
        return res.status(401).json(err)
    }
}
