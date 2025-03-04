const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authEmController = require('../controllers/authEmController')

router.post('/register', authController.register);

router.post('/login', authController.login)

router.post('/registershopowner', authController.registershopowner)


//จัดการพนักงาน
router.post('/loginemployee',authController.loginemployee)

router.post('/registeremployee', authEmController.registeremployee)

router.get('/getemployees', authEmController.getEmployee);

router.put('/updateemployee/:id', authEmController.updateemployee);


module.exports = router