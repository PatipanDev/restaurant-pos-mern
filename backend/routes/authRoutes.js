const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/login', authController.login)

router.post('/registershopowner', authController.registershopowner)

router.post('/loginemployee',authController.loginemployee)
module.exports = router