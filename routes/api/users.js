const express = require('express');
const router = express.Router();
const authCtrl = require('../../controllers/authControllers');


/*---------- Public Routes ----------*/
router.post('/signup', authCtrl.signup);

/*---------- Protected Routes ----------*/