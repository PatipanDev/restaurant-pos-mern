const EmployeeSupplier = require('../models/EmployeeSupplier'); // เปลี่ยนจาก Product เป็น EmployeeSupplier
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// เพิ่มพนักงานซัพพลายเออร์ใหม่
exports.addEmployeeSupplier = async (req, res) => {
    const { employee_Sub_Name, bio, address, job_Title, date_Of_Birth, national_Id, supplier_Id } = req.body;

    try {
        // ตรวจสอบว่ามีพนักงานซัพพลายเออร์นี้ในระบบหรือไม่
        let employee = await EmployeeSupplier.findOne({ national_Id });
        if (employee) {
            return res.status(400).json({ message: 'พนักงานซัพพลายเออร์นี้มีอยู่แล้ว' });
        }

        // สร้างพนักงานซัพพลายเออร์ใหม่
        employee = new EmployeeSupplier({
            employee_Sub_Name,
            bio,
            address,
            job_Title,
            date_Of_Birth,
            national_Id,
            supplier_Id
        });

        // บันทึกพนักงานซัพพลายเออร์ในฐานข้อมูล
        await employee.save();

        res.status(201).json({
            _id: employee._id,
            employee_Sub_Name: employee.employee_Sub_Name,
            bio: employee.bio,
            address: employee.address,
            job_Title: employee.job_Title,
            date_Of_Birth: employee.date_Of_Birth,
            national_Id: employee.national_Id,
            supplier_Id: employee.supplier_Id,
            message: 'เพิ่มพนักงานซัพพลายเออร์ใหม่สำเร็จ'
        });
    } catch (error) {
        console.error("Error during Employee Supplier registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะเพิ่มพนักงานซัพพลายเออร์',
            error: error.message || error
        });
    }
};

// ดึงข้อมูลพนักงานซัพพลายเออร์ทั้งหมด
exports.getEmployeeSuppliers = async (req, res) => {
    try {
        const employees = await EmployeeSupplier.find()
            .populate('supplier_Id'); // ดึงข้อมูลซัพพลายเออร์

        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employee suppliers:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// อัปเดตข้อมูลพนักงานซัพพลายเออร์
exports.updateEmployeeSupplier = async (req, res) => {
    const { id } = req.params;
    const { employee_Sub_Name, bio, address, job_Title, date_Of_Birth, national_Id, supplier_Id } = req.body;

    try {
        // 🔹 ดึงข้อมูลพนักงานซัพพลายเออร์ก่อนอัปเดต
        const employee = await EmployeeSupplier.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'ไม่พบพนักงานซัพพลายเออร์' });
        }

        // 🔹 อัปเดตเฉพาะค่าที่มีการเปลี่ยนแปลง
        employee.employee_Sub_Name = employee_Sub_Name ?? employee.employee_Sub_Name;
        employee.bio = bio ?? employee.bio;
        employee.address = address ?? employee.address;
        employee.job_Title = job_Title ?? employee.job_Title;
        employee.date_Of_Birth = date_Of_Birth ?? employee.date_Of_Birth;
        employee.national_Id = national_Id ?? employee.national_Id;
        employee.supplier_Id = supplier_Id ?? employee.supplier_Id;

        // 🔹 บันทึกข้อมูลที่อัปเดต
        await employee.save();

        res.status(200).json({
            message: 'อัปเดตข้อมูลพนักงานซัพพลายเออร์สำเร็จ',
            updatedEmployee: employee
        });

    } catch (error) {
        console.error('❌ Error updating employee supplier:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตพนักงานซัพพลายเออร์', error: error.message });
    }
};

// ลบพนักงานซัพพลายเออร์
exports.deleteEmployeeSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        // 🔹 ตรวจสอบว่าพนักงานซัพพลายเออร์มีอยู่หรือไม่
        const employee = await EmployeeSupplier.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'ไม่พบพนักงานซัพพลายเออร์' });
        }

        // 🔹 ลบพนักงานซัพพลายเออร์
        await employee.deleteOne();

        res.status(200).json({ message: 'ลบข้อมูลพนักงานซัพพลายเออร์สำเร็จ' });

    } catch (error) {
        console.error('❌ Error deleting employee supplier:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบพนักงานซัพพลายเออร์', error: error.message });
    }
};
