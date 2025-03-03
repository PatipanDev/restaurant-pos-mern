const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



// สมัครสมาชิก
exports.register = async (req, res) => {
    const { customer_Name, customer_Email, customer_Password, customer_Telnum } = req.body;

    try {
        // หาว่ามีอีเมลเดิมหรือป่าว
        let customer = await Customer.findOne({ customer_Email });
        if (customer) return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });
        

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(customer_Password, 10);
        customer = new Customer({ customer_Name, customer_Email, customer_Password: hashedPassword, customer_Telnum });

        await customer.save();

        res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
    } catch (error) {
        console.error("Error during registration:", error); // log ข้อความ error ลงใน console
        res.status(500).json({ 
            message: error.message,
            error: error.message || error // ส่งข้อมูลข้อผิดพลาดกลับไป
        });
    }
};


exports.login = async (req, res) => {
    const { customer_Email, customer_Password } = req.body;

    try {
        const customer = await Customer.findOne({ customer_Email });
        if (!customer) return res.status(400).json({ message: 'ไม่พบผู้ใช้' });

        const isMatch = await bcrypt.compare(customer_Password, customer.customer_Password);
        if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

        const token = jwt.sign({ customer_Id: customer.customer_Id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // ส่งข้อมูลและ token กลับไป
        res.status(200).json({
            token,
            customer: {
                customer_Id: customer.customer_Id,
                customer_Name: customer.customer_Name,
                customer_Email: customer.customer_Email
            }
        });
    } catch (error) {
        console.error("Error during login:", error); // log ข้อความ error ลงใน console
        res.status(500).json({
            message: error.message,
            error: error.message || error // ส่งข้อมูลข้อผิดพลาดกลับไป
        });
    }
};
