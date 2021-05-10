const express = require('express');
const router = express.Router();
const authCtrl = require('../../controllers/authControllers');

router.get('/', authCtrl.getAllUsers);

/*---------- Public Routes ----------*/
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

/*---------- Protected Routes ----------*/
router.get('/:id', authCtrl.findUser);
router.put('/:id', authCtrl.editUser);

module.exports = router