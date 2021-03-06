
//Address
const Address = require('../models/address');


module.exports = {
  getAllAddresses,
  getOneAddress,
  editOneAddress,
  getAddressFromUser
}

async function getAllAddresses(req, res){
    console.log(req.user, "req.user from getAllAddresses <-------++-----")
    
    try{
        if(!req.user.isAdmin){
            throw err;
        }
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
        const address = await Address.findOne({_id: req.params.id}).populate('user').populate('attic').populate('house')
            .populate('roof').populate('spHeater').populate('utility')
            .populate('waHeater').exec();
        console.log(address.house, "address from getOne BE <------")
        res.status(200).json({address});
    } catch(err){
        return res.status(401).json(err)
    }
}

async function getAddressFromUser(req, res){
    console.log(req.params.id, "req.params from useraddress <-----")
    try{
        const address = await Address.findOne({user: req.params.id}).populate('user').populate('attic').populate('house')
            .populate('roof').populate('spHeater').populate('utility')
            .populate('waHeater').exec();
        console.log(address, "address from USERGetOne BE <------")
        res.status(200).json({address});
    } catch(err){
        return res.status(401).json(err)
    }
}

// currently only set up for verified
async function editOneAddress(req, res){
    
    try{
        console.log(req.params.id, "<----- backend edit one address firing")
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, {verified: req.body.verified}, {new: true});
        // await Address.findById(req.params.id, async function (err, address){
        //     console.log(req.body, "req.body <---------")
        //     // user = doc;
        //     if(address){
        //     //   for (const key in req.body) {
        //     //     if(address[key]){
        //     //         address[key] = req.body[key];
        //     //     }  
                
        //     // }
        //     address.verified = req.body.verified;
        //     console.log(address, "address from edit");
        //     // user = {...req.body, _id: req.params.id}
        //     await address.save();
        //     console.log(address, "address updated");
            
        //   }
        //   });
        

        console.log(updatedAddress.house, "updatedAddress from editBE <------")
        res.status(200).json({updatedAddress});
    } catch(err){
        console.log("There was a controller error")
        res.send(err)
        // return res.status(401).json(err)
    }
}