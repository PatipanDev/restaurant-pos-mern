const Cashier = require('../models/Cashier'); // เปลี่ยนเป็น Cashier model
const bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registercashier = async (req, res) => {
    const { 
        cashier_Name, 
        cashier_Password, 
        cashier_Address, 
        cashier_Weight, 
        cashier_Height, 
        cashier_Gender, 
        cashier_Birthdate 
    } = req.body;

    try {
        // ตรวจสอบว่าชื่อซ้ำหรือไม่
        let cashier = await Cashier.findOne({ cashier_Name });
        if (cashier) {
            return res.status(400).json({ message: 'ชื่อนี้ถูกใช้ไปแล้ว' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(cashier_Password, 10);

        // สร้าง Cashier ใหม่
        cashier = new Cashier({
            cashier_Name,
            cashier_Password: hashedPassword,
            cashier_Address,
            cashier_Weight,
            cashier_Height,
            cashier_Gender,
            cashier_Birthdate
        });

        // บันทึกข้อมูล Cashier ลงฐานข้อมูล
        await cashier.save();

        res.status(201).json({ 
            _id: cashier._id,
            cashier_Name: cashier.cashier_Name,
            cashier_Address: cashier.cashier_Address,
            cashier_Weight: cashier.cashier_Weight,
            cashier_Height: cashier.cashier_Height,
            cashier_Gender: cashier.cashier_Gender,
            cashier_Birthdate: cashier.cashier_Birthdate,
            message: 'สมัครสมาชิก Cashier สำเร็จ' 
        });
    } catch (error) {
        console.error("Error during Cashier registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะสมัครสมาชิก',
            error: error.message || error
        });
    }
};


exports.getcashiers = async (req, res) => {
    try {
        const cashiers = await Cashier.find();
        res.status(200).json(cashiers);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};


exports.updatecashier = async (req, res) => {
    const { id } = req.params;
    const { cashier_Name, cashier_Password, cashier_Address, cashier_Weight, cashier_Height, cashier_Gender, cashier_Birthdate } = req.body;

    try {
        const cashier = await Cashier.findById(id);
        if (!cashier) return res.status(404).json({ message: 'ไม่พบพนักงานแคชเชียร์' });

        // อัปเดตข้อมูลพนักงานแคชเชียร์
        cashier.cashier_Name = cashier_Name;
        cashier.cashier_Password = await bcrypt.hash(cashier_Password, 10);
        cashier.cashier_Address = cashier_Address;
        cashier.cashier_Weight = cashier_Weight;
        cashier.cashier_Height = cashier_Height;
        cashier.cashier_Gender = cashier_Gender;
        cashier.cashier_Birthdate = cashier_Birthdate;

        await cashier.save();

        res.status(200).json({ message: 'อัปเดตข้อมูลพนักงานแคชเชียร์สำเร็จ' });
    } catch (error) {
        console.error('Error updating cashier:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

exports.deletecashier = async (req, res) => {
    const { id } = req.params;

    try {
        const cashier = await Cashier.findByIdAndDelete(id);
        
        if (!cashier) {
            return res.status(404).json({ message: 'ไม่พบพนักงานแคชเชียร์' });
        }

        res.status(200).json({ message: 'ลบข้อมูลพนักงานแคชเชียร์สำเร็จ' });
    } catch (error) {
        console.error('Error deleting cashier:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};