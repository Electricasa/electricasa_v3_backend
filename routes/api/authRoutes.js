const express = require('express');
const router = express.Router();
const authCtrl = require('../../controllers/authControllers');



/*---------- Public Routes ----------*/
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

/*---------- Protected Routes ----------*/
router.get('/:id', authCtrl.findUser);
router.put('/:id', authCtrl.editUser);

router.get('/', authCtrl.getAllUsers);

module.exports = router