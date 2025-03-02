const express = require('express');
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

router.post('/register', [
    body('customer_Name').not().isEmpty().withMessage('กรุณากรอกชื่อผู้ใช้'),
    body('customer_Email').isEmail().withMessage('กรุณากรอกอีเมลที่ถูกต้อง'),
    body('customer_Password').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    body('customer_Telnum')
        .isLength({ min: 10, max: 10 }).withMessage('เบอร์โทรต้องมี 10 ตัว')
        .isNumeric().withMessage('เบอร์โทรต้องเป็นตัวเลขเท่านั้น')
], register);


//  ล็อกอิน
router.post('/login',[
    body('customer_Email').isEmail().withMessage('กรุณากรอกอีเมลที่ถูกต้อง'),
    body('customer_Password').not().isEmpty().withMessage('กรุณากรอกรหัสผ่าน')
], login);

module.exports = router;
