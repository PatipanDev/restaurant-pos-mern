const Chef = require('../models/Chef'); // เปลี่ยนเป็น Chef model
const bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerChef = async (req, res) => {
    const { 
        chef_Name, 
        chef_Password, 
        chef_Details, 
        chef_Weight, 
        chef_Height, 
        chef_Birthday 
    } = req.body;

    try {
        // ตรวจสอบว่าชื่อซ้ำหรือไม่
        let chef = await Chef.findOne({ chef_Name });
        if (chef) {
            return res.status(400).json({ message: 'ชื่อนี้ถูกใช้ไปแล้ว' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(chef_Password, 10);

        // สร้าง Chef ใหม่
        chef = new Chef({
            chef_Name,
            chef_Password: hashedPassword,
            chef_Details,
            chef_Weight,
            chef_Height,
            chef_Birthday
        });

        // บันทึกข้อมูล Chef ลงฐานข้อมูล
        await chef.save();

        res.status(201).json({ 
            _id: chef._id,
            chef_Name: chef.chef_Name,
            chef_Details: chef.chef_Details,
            chef_Weight: chef.chef_Weight,
            chef_Height: chef.chef_Height,
            chef_Birthday: chef.chef_Birthday,
            message: 'สมัครสมาชิก Chef สำเร็จ' 
        });
    } catch (error) {
        console.error("Error during Chef registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะสมัครสมาชิก',
            error: error.message || error
        });
    }
};

exports.getChefs = async (req, res) => {
    try {
        const chefs = await Chef.find();
        res.status(200).json(chefs);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

exports.updateChef = async (req, res) => {
    const { id } = req.params;
    const { chef_Name, chef_Password, chef_Details, chef_Weight, chef_Height, chef_Birthday } = req.body;

    try {
        const chef = await Chef.findById(id);
        if (!chef) return res.status(404).json({ message: 'ไม่พบพนักงานเชฟ' });

        // อัปเดตข้อมูลพนักงานเชฟ
        chef.chef_Name = chef_Name;
        chef.chef_Password = await bcrypt.hash(chef_Password, 10);
        chef.chef_Details = chef_Details;
        chef.chef_Weight = chef_Weight;
        chef.chef_Height = chef_Height;
        chef.chef_Birthday = chef_Birthday;

        await chef.save();

        res.status(200).json({ message: 'อัปเดตข้อมูลพนักงานเชฟสำเร็จ' });
    } catch (error) {
        console.error('Error updating chef:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

exports.deleteChef = async (req, res) => {
    const { id } = req.params;

    try {
        const chef = await Chef.findByIdAndDelete(id);
        
        if (!chef) {
            return res.status(404).json({ message: 'ไม่พบพนักงานเชฟ' });
        }

        res.status(200).json({ message: 'ลบข้อมูลพนักงานเชฟสำเร็จ' });
    } catch (error) {
        console.error('Error deleting chef:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};