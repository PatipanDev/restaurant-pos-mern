const Customer = require('../models/Customer');
const ShopOwner = require('../models/ShopOwner');  // โหลด ShopOwner model ที่สร้างไว้
const Employee = require('../models/Employee');
const Cashier = require('../models/Cashier');
const Chef = require('../models/Chef');
// const Chef = require('../models/Chef')


const express = require('express'); // เพิ่มบรรทัดนี้
const router = express.Router();

const bcrypt = require('bcryptjs');
// const cookieParser = require('cookie-parser');
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


// ล็อกอินผู้ใช้
exports.login = async (req, res) => {
    const { customer_Email, customer_Password } = req.body;

    try {
        const customer = await Customer.findOne({ customer_Email });
        if (!customer) {
            return res.status(400).json({ message: 'ไม่พบผู้ใช้' });
        }

        if (!customer.customer_Password) {
            return res.status(400).json({ message: 'บัญชีนี้ไม่มีรหัสผ่าน' });
        }

        const isMatch = await bcrypt.compare(customer_Password, customer.customer_Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // 🔹 เก็บไอดี, ชื่อ, role ใน Token
        const payload = {
            customer_Id: customer._id,
            customer_Name: customer.customer_Name,
            role: "user",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

        // ✅ ใช้ HTTP-only Cookie เก็บ Token
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        //     maxAge: 3600000, // 1 ชั่วโมง
        // });


        //ถ้าใช้ HTTP ธรรมดา
        res.cookie('token', token, {
            httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
            secure: false,  // เนื่องจากใช้ HTTP, ไม่ใช่ HTTPS
            sameSite: 'Lax', // เลือก Lax หรือ Strict ขึ้นอยู่กับกรณีการใช้งาน
            maxAge: 10800000, // ตั้งเวลาหมดอายุของคุกกี้ 1 ชั่วโมง
        });

        // ✅ ส่งข้อมูลผู้ใช้กลับ
        return res.status(200).json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",
            user: {
                customer_Id: customer._id,
                customer_Name: customer.customer_Name,
                role: "user"
            }
        });

    } catch (error) {
        console.error("Error during login:", error.stack);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
    }
};








//*********************************************************************************************************************************** */
//ล็อกอินพนักงาน
exports.loginemployee = async (req, res) => {
    const { employee_Name, employee_Password, employee_Role } = req.body;

    try {
        let user;
        let passwordField;
        const role = employee_Role; // ไม่ต้องแปลงเป็นตัวเลขแล้ว

        switch (role) {
            case "employee": // พนักงานทั่วไป
                user = await Employee.findOne({ employee_Name });
                passwordField = "employee_Password";
                break;
            case "cashier": // แคชเชียร์
                user = await Cashier.findOne({ cashier_Name: employee_Name });
                passwordField = "cashier_Password";
                break;
            case "chef": // เชฟ
                user = await Chef.findOne({ chef_Name: employee_Name });
                passwordField = "chef_Password";
                break;
            case "owner": // เจ้าของร้าน
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

        const payload = {
            customer_Id: user._id,
            customer_Name: employee_Name,
            role: role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });


        // ✅ ใช้ HTTP-only Cookie เก็บ Token
        // res.cookie('token', token, {
        //     httpOnly: true, // ✅ ป้องกัน XSS
        //     secure: process.env.NODE_ENV === 'production', // ✅ ใช้ HTTPS ใน production
        //     sameSite: 'Strict', // ✅ ป้องกัน CSRF
        //     maxAge: 3600000, // ✅ หมดอายุใน 1 ชั่วโมง
        // });

        //ถ้าใช้ HTTP ธรรมดา
        res.cookie('token', token, {
            httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
            secure: false,  // เนื่องจากใช้ HTTP, ไม่ใช่ HTTPS
            sameSite: 'Lax', // เลือก Lax หรือ Strict ขึ้นอยู่กับกรณีการใช้งาน
            maxAge: 10800000, // ตั้งเวลาหมดอายุของคุกกี้ 1 ชั่วโมง
        });

        res.status(200).json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",
            user: {
                _id: user._id,
                employee_Name: employee_Name,
                role: role // ส่งเป็น string
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
        let owner = await ShopOwner.findOne({ owner_Name });
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

exports.getAccoutCustomer = async (req, res) => {
    const { user_id } = req.params; // หรือ req.query.user_id ถ้าใช้ query
    try {
        const customer = await Customer.findOne({ user_id })
            .select('customer_Email customer_Name customer_Telnum createdAt'); // เลือกฟิลด์ที่ต้องการดึง

        if (!customer) {
            return res.status(404).json({
                message: 'ไม่พบข้อมูลลูกค้า'
            });
        }

        res.status(200).json({
            message: 'ดึงข้อมูลสำเร็จ',
            customer
        });
    } catch (error) {
        console.log("Error fetching data Customer", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message || error
        });
    }
};


exports.updateAccoutCustomeer = async (req, res) => {
    const {user_id} = req.params;
    console.log(user_id)
    const {
        customer_Name,
        customer_Email,
        customer_Telnum
    } = req.body
    try{
        const customer = await Customer.findById(user_id)
        if(!customer){
            return res.status(404).json({
                message:'ไม่พบข้อมูลในการอัพเดต'
            })
        }

        customer.customer_Name = customer_Name
        // customer.customer_Email = customer_Email
        customer.customer_Telnum = customer_Telnum

        await customer.save();
        res.status(200).json({
            message: 'อัพเดตข้อมูลสำเร็จ',
            customer
        })
    }  catch (error) {
        console.log("Error Update data Customer", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message || error
        });
    }
}









