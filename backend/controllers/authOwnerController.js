const ShopOwner = require('../models/ShopOwner'); // เปลี่ยนเป็นโมเดล ShopOwner
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// สมัครสมาชิกเจ้าของร้าน
exports.registerShopOwner = async (req, res) => {
    const { owner_Name, owner_Password, owner_Details } = req.body;

    try {
        // ตรวจสอบว่าชื่อซ้ำหรือไม่
        let owner = await ShopOwner.findOne({ owner_Name });
        if (owner) {
            return res.status(400).json({ message: 'ชื่อนี้ถูกใช้ไปแล้ว' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(owner_Password, 10);

        // สร้างเจ้าของร้านใหม่
        owner = new ShopOwner({
            owner_Name,
            owner_Password: hashedPassword,
            owner_Details
        });

        // บันทึกข้อมูลลงฐานข้อมูล
        await owner.save();

        res.status(201).json({ 
            _id: owner._id,
            owner_Name: owner.owner_Name,
            owner_Details: owner.owner_Details,
            message: 'สมัครสมาชิกเจ้าของร้านสำเร็จ' 
        });
    } catch (error) {
        console.error("Error during ShopOwner registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะสมัครสมาชิก',
            error: error.message || error
        });
    }
};

// ดึงข้อมูลเจ้าของร้านทั้งหมด
exports.getShopOwners = async (req, res) => {
    try {
        const owners = await ShopOwner.find();
        res.status(200).json(owners);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// อัปเดตข้อมูลเจ้าของร้าน
exports.updateShopOwner = async (req, res) => {
    const { id } = req.params;
    const { owner_Name, owner_Password, owner_Details } = req.body;

    try {
        const owner = await ShopOwner.findById(id);
        if (!owner) return res.status(404).json({ message: 'ไม่พบเจ้าของร้าน' });

        // อัปเดตข้อมูลเจ้าของร้าน
        owner.owner_Name = owner_Name;
        owner.owner_Details = owner_Details;

        // อัปเดตรหัสผ่านเฉพาะเมื่อมีการส่งค่ามาใหม่
        if (owner_Password) {
            owner.owner_Password = await bcrypt.hash(owner_Password, 10);
        }

        await owner.save();

        res.status(200).json({ message: 'อัปเดตข้อมูลเจ้าของร้านสำเร็จ' });
    } catch (error) {
        console.error('Error updating shop owner:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

// ลบข้อมูลเจ้าของร้าน
exports.deleteShopOwner = async (req, res) => {
    const { id } = req.params;

    try {
        const owner = await ShopOwner.findByIdAndDelete(id);
        
        if (!owner) {
            return res.status(404).json({ message: 'ไม่พบเจ้าของร้าน' });
        }

        res.status(200).json({ message: 'ลบข้อมูลเจ้าของร้านสำเร็จ' });
    } catch (error) {
        console.error('Error deleting shop owner:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};
