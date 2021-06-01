const express = require('express');
const router = express.Router();
const adminNoteCtrl = require('../../controllers/adminNoteControllers');



/*---------- Public Routes ----------*/

// an address is created when a user signs up
// addresses are edited automatically through component controllers

/*---------- Protected Routes ----------*/


router.post('/:id', addressCtrl.createAdminNote);


module.exports = router