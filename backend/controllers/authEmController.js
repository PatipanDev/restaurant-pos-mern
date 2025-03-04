const Employee = require('../models/Employee');  // Ensure you have this model imported
const bcrypt = require('bcryptjs'); // bcryptjs for password hashing

const express = require('express'); // เพิ่มบรรทัดนี้
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registeremployee = async (req, res) => {
    const { 
        employee_Name, 
        employee_Password, 
        employee_Citizen_id, 
        employee_Weight, 
        employee_Height, 
        employee_Address, 
        employee_Details, 
        employee_Birthday 
    } = req.body;

    try {
        // ตรวจสอบว่า Citizen ID ซ้ำหรือไม่
        let employee = await Employee.findOne({ employee_Citizen_id });
        if (employee) {
            return res.status(400).json({ message: 'รหัสประชาชนนี้ถูกใช้ไปแล้ว' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(employee_Password, 10);

        // สร้าง Employee ใหม่
        employee = new Employee({
            employee_Name,
            employee_Password: hashedPassword,
            employee_Citizen_id,
            employee_Weight,
            employee_Height,
            employee_Address,
            employee_Details,
            employee_Birthday
        });

        // บันทึกข้อมูล Employee ลงฐานข้อมูล
        await employee.save();

        res.status(201).json({ 
            _id: employee._id,
            employee_Name: employee.employee_Name,
            employee_Citizen_id: employee.employee_Citizen_id,
            employee_Weight: employee.employee_Weight,
            employee_Height: employee.employee_Height,
            employee_Address: employee.employee_Address,
            employee_Details: employee.employee_Details,
            employee_Birthday: employee.employee_Birthday,
            message: 'สมัครสมาชิก Employee สำเร็จ'  // ถ้าต้องการเพิ่มข้อความ
            
        });
    } catch (error) {
        console.error("Error during Employee registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะสมัครสมาชิก',
            error: error.message || error
        });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const employees = await Employee.find();
        
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};



exports.updateemployee = async (req, res) => {
    const { id } = req.params;
    const { employee_Name, employee_Password, employee_Weight, employee_Height, employee_Address, employee_Details, employee_Birthday } = req.body;

    try {
        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

        // อัปเดตข้อมูลพนักงาน
        employee.employee_Name = employee_Name;
        employee.employee_Password = await bcrypt.hash(employee_Password, 10);  // เข้ารหัสใหม่หากมีการเปลี่ยนรหัสผ่าน
        employee.employee_Weight = employee_Weight;
        employee.employee_Height = employee_Height;
        employee.employee_Address = employee_Address;
        employee.employee_Details = employee_Details;
        employee.employee_Birthday = employee_Birthday;

        await employee.save();

        res.status(200).json({ message: 'อัปเดตข้อมูลพนักงานสำเร็จ' });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};


exports.deleteemployee = async (req, res) => {
    const { id } = req.params;  // รับ id จาก params

    try {
        // ลบพนักงานโดยใช้ findByIdAndDelete
        const employee = await Employee.findByIdAndDelete(id);
        
        if (!employee) {
            return res.status(404).json({ message: 'ไม่พบพนักงาน' });
        }

        res.status(200).json({ message: 'ลบข้อมูลพนักงานสำเร็จ' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};




