const express = require("express");
const { register, login } = require("../controllers/authController");
const { body, validationResult } = require("express-validator");  // นำเข้า validationResult

const router = express.Router();

router.post("/register", [
    body("customer_Name")
        .notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้")
        .isLength({ min: 3 }).withMessage("ชื่อผู้ใช้ต้องมีความยาวไม่น้อยกว่า 3 ตัวอักษร"),

    body("customer_Email")
        .notEmpty().withMessage("กรุณากรอกอีเมลที่ถูกต้อง")
        .isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),

    body("customer_Password")
        .notEmpty().withMessage("กรุณากรอกรหัสผ่าน")
        .isLength({ min: 6 }).withMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
        .matches(/[0-9]/).withMessage("รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว")
        .matches(/[A-Za-z]/).withMessage("รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษอย่างน้อย 1 ตัว"),

    body("customer_Telnum")
        .notEmpty().withMessage("กรุณากรอกหมายเลขโทรศัพท์")
        .isLength({ min: 10, max: 10 }).withMessage("เบอร์โทรต้องมี 10 ตัว")
        .isNumeric().withMessage("เบอร์โทรต้องเป็นตัวเลขเท่านั้น")
        .custom((value) => /^[0-9]{10}$/.test(value)).withMessage("เบอร์โทรต้องมีเพียงตัวเลข 10 หลัก"),
], (req, res, next) => {
    const errors = validationResult(req);  // ใช้ validationResult ที่นำเข้า

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => {
            switch (error.param) {
                case 'customer_Name':
                    return { msg: "กรุณากรอกชื่อผู้ใช้ให้ครบถ้วน" };
                case 'customer_Email':
                    return { msg: "กรุณากรอกอีเมลที่ถูกต้อง" };
                case 'customer_Password':
                    return { msg: "กรุณากรอกรหัสผ่านที่มีความยาวไม่น้อยกว่า 6 ตัว" };
                case 'customer_Telnum':
                    return { msg: "กรุณากรอกเบอร์โทรที่เป็นตัวเลข 10 หลัก" };
                default:
                    return error;
            }
        });

        return res.status(400).json({ errors: errorMessages });
    }

    next();  // ถ้าไม่มีข้อผิดพลาดให้ไปยังฟังก์ชัน register
}, register);

// ตรวจสอบข้อมูลล็อกอิน
router.post("/login", [
    body("customer_Email").isEmail().withMessage("กรุณากรอกอีเมลที่ถูกต้อง"),
    body("customer_Password").notEmpty().withMessage("กรุณากรอกรหัสผ่าน")
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            msg: error.msg
        }));

        // ส่งข้อความ error ไปยัง client
        return res.status(400).json({ errors: errorMessages });
    }

    next();  // ถ้าไม่มีข้อผิดพลาดให้ไปยังฟังก์ชัน login
}, login);

module.exports = router;
