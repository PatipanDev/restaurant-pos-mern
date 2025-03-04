const Customer = require('../models/Customer');
const ShopOwner = require('../models/ShopOwner');  // โหลด ShopOwner model ที่สร้างไว้
const Employee = require('../models/Employee');
const Cashier = require('../models/Cashier');
const Chef = require('../models/Chef');
  // 
 
const express = require('express'); // เพิ่มบรรทัดนี้
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



// สมัครสมาชิก
exports.register = async (req, res) => {
    const { customer_Name, customer_Email, customer_Password, customer_Telnum } = req.body;

    try {
        // หาว่ามีอีเมลเดิมหรือป่าว
        let customer = await Customer.findOne({customer_Email });
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
                customer_Email: customer.employee_Name
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





//*********************************************************************************************************************************** */

exports.loginemployee = async (req, res) => {
    const { employee_Name, employee_Password, employee_Role } = req.body;

    try {
        let user;
        let passwordField;
        const role = Number(employee_Role); // แปลง role เป็นตัวเลข

        switch (role) {
            case 1: // พนักงานทั่วไป
                user = await Employee.findOne({ employee_Name });
                passwordField = "employee_Password";
                break;
            case 2: // แคชเชียร์
                user = await Cashier.findOne({ cashier_Name: employee_Name });
                passwordField = "cashier_Password";
                break;
            case 3: // เชฟ
                user = await Chef.findOne({ Chef_Name: employee_Name });
                passwordField = "Chef_Password";
                break;
            case 4: // เจ้าของร้าน
                user = await ShopOwner.findOne({ owner_Name: employee_Name });
                passwordField = "owner_Password";
                break;
            default:
                return res.status(400).json({ message: 'ตำแหน่งไม่ถูกต้อง' });
        }

        if (!user) {
            return res.status(400).json({ message: 'ไม่พบผู้ใช้' });
        }

        const isMatch = await bcrypt.compare(employee_Password, user[passwordField]);
        if (!isMatch) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        const token = jwt.sign(
            { userId: user._id, employee_Name, employee_Role: role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: employee_Name,
                role
            }
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการล็อกอิน',
            error: error.message
        });
    }
};




// สมัครสมาชิก ShopOwner
exports.registershopowner = async (req, res) => {
    const { owner_Name, owner_Password, owner_Details } = req.body;

    try {
        // ตรวจสอบว่ามีอีเมลซ้ำหรือไม่
        let owner = await ShopOwner.findOne({ owner_Name});
        if (owner) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(owner_Password, 10);

        // สร้าง ShopOwner ใหม่
        owner = new ShopOwner({
            owner_Name,
            owner_Password: hashedPassword,
            owner_Details
        });

        // บันทึกข้อมูล ShopOwner ลงฐานข้อมูล
        await owner.save();

        res.status(201).json({ message: 'สมัครสมาชิก ShopOwner สำเร็จ' });
    } catch (error) {
        console.error("Error during ShopOwner registration:", error); // log ข้อความ error ลงใน console
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะสมัครสมาชิก',
            error: error.message || error // ส่งข้อมูลข้อผิดพลาดกลับไป
        });
    }
};






//******************************************************************************************************************************************/
//เพิ่มข้อมูลพนักงา









