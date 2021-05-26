const express = require('express');
const router = express.Router();
const addressCtrl = require('../../controllers/addressControllers');



/*---------- Public Routes ----------*/

// an address is created when a user signs up
// addresses are edited automatically through component controllers

/*---------- Protected Routes ----------*/

router.get('/', addressCtrl.getAllAddresses);
router.get('/:id', addressCtrl.getOneAddress);

module.exports = router