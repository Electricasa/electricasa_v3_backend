const express = require('express');
const router = express.Router();
const addressCtrl = require('../../controllers/addressControllers');



/*---------- Public Routes ----------*/

// an address is created when a user signs up
// addresses are edited automatically through component controllers

/*---------- Protected Routes ----------*/

router.get('/', addressCtrl.getAllAddresses);
router.get('/userAddress/:id', addressCtrl.getAddressFromUser);
router.get('/:id', addressCtrl.getOneAddress);
router.put('/:id', addressCtrl.editOneAddress);

module.exports = router