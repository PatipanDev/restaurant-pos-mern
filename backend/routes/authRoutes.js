const express = require('express');
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

// ✅ สมัครสมาชิก
router.post('/register', [
    body('username').not().isEmpty().withMessage('กรุณากรอกชื่อผู้ใช้'),
    body('email').isEmail().withMessage('กรุณากรอกอีเมลที่ถูกต้อง'),
    body('password').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
], register);

// ✅ ล็อกอิน
router.post('/login', login);

module.exports = router;
