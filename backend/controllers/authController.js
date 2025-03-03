const Customer = require('../models/Customer');
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
        const customer = await Customer.findOne({ employee_Name: customer_Email });
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


exports.loginemployee = async (req, res) => {
    const { employee_Name, employee_Password, employee_Role } = req.body;

    try {
        let employee;

        // ตรวจสอบตำแหน่งพนักงาน (employee_Role) และเลือกค้นหาจาก table ที่เหมาะสม
        if (employee_Role === 1) {  // พนักงานทั่วไป
            employee = await Employee.findOne({ employee_Name });
        } else if (employee_Role === 2) {  // แคชเชียร์
            employee = await Cashier.findOne({ employee_Name });
        } else if (employee_Role === 3) {  // เชฟ
            employee = await Chef.findOne({ employee_Name });
        } else if (employee_Role === 4) {  // เจ้าของร้าน
            employee = await Owner.findOne({ employee_Name });
        } else {
            return res.status(400).json({ message: 'ตำแหน่งไม่ถูกต้อง' });
        }

        // ตรวจสอบว่าพนักงานที่ค้นหามีอยู่หรือไม่
        if (!employee) return res.status(400).json({ message: 'ไม่พบผู้ใช้' });

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(employee_Password, employee.employee_Password);
        if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

        // สร้าง JWT token
        const token = jwt.sign({ employee_Id: employee.employee_Id }, process.env.JWT_SECRET, { expiresIn: '8h' });

        // ส่งข้อมูลและ token กลับไป
        res.status(200).json({
            token,
            employee: {
                employee_Id: employee.employee_Id,
                employee_Name: employee.employee_Name,
                employee_Role: employee.employee_Role,  // ส่งตำแหน่งพนักงาน
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




