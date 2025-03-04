const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authEmController = require('../controllers/authEmController')
const authCasController = require('../controllers/authCasController')

router.post('/register', authController.register);

router.post('/login', authController.login)

router.post('/registershopowner', authController.registershopowner)


//ล็อคอินรวมทั้งหมด
router.post('/loginemployee',authController.loginemployee)


// จัดการพนักงาน
router.post('/registeremployee', authEmController.registeremployee)

router.get('/getemployees', authEmController.getEmployee);

router.put('/updateemployee/:id', authEmController.updateemployee);

router.delete('/deleteemployee/:id', authEmController.deleteemployee)


// จัดการแคชเชียร์
router.post('/registercashier', authCasController.registercashier)

router.get('/getcashiers', authCasController.getcashiers);

router.put('/updatecashier/:id', authCasController.updatecashier);

// router.delete('/deletecashier/:id', authCasController.deleteCashier)


module.exports = router