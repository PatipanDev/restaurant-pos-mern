const Unit = require('../models/Unit'); // ใช้โมเดล Unit แทน ProductCategory
const express = require('express');
require('dotenv').config();

// สร้างหน่วยสินค้าใหม่
exports.createUnit = async (req, res) => {
    const { unit_Name, unit_Symbol } = req.body; // เปลี่ยนเป็น unit_Name และ unit_Symbol

    try {
        // ตรวจสอบว่าชื่อหน่วยซ้ำหรือไม่
        let unit = await Unit.findOne({ unit_Name }); // ใช้ unit_Name
        if (unit) {
            return res.status(400).json({ message: 'ชื่อหน่วยนี้มีอยู่แล้ว' });
        }

        // สร้างหน่วยสินค้าใหม่
        unit = new Unit({ unit_Name, unit_Symbol }); // สร้างหน่วยด้วย unit_Name และ unit_Symbol

        // บันทึกข้อมูลลงฐานข้อมูล
        await unit.save();

        res.status(201).json({ 
            _id: unit._id,
            unit_Name: unit.unit_Name,
            unit_Symbol: unit.unit_Symbol,
            message: 'เพิ่มหน่วยสินค้าสำเร็จ' 
        });
    } catch (error) {
        console.error("Error during unit creation:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะเพิ่มหน่วยสินค้า',
            error: error.message || error
        });
    }
};


// ดึงข้อมูลหน่วยสินค้าทั้งหมด
exports.getUnits = async (req, res) => {
    try {
        const units = await Unit.find();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// อัปเดตหน่วยสินค้า
exports.updateUnit = async (req, res) => {
    const { id } = req.params;
    const { unit_name } = req.body;

    try {
        const unit = await Unit.findById(id);
        if (!unit) return res.status(404).json({ message: 'ไม่พบหน่วยสินค้า' });

        // อัปเดตชื่อหน่วยสินค้า
        unit.unit_name = unit_name;

        await unit.save();

        res.status(200).json({ message: 'อัปเดตหน่วยสินค้าสำเร็จ' });
    } catch (error) {
        console.error('Error updating unit:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

// ลบหน่วยสินค้า
exports.deleteUnit = async (req, res) => {
    const { id } = req.params;

    try {
        const unit = await Unit.findByIdAndDelete(id);
        
        if (!unit) {
            return res.status(404).json({ message: 'ไม่พบหน่วยสินค้า' });
        }

        res.status(200).json({ message: 'ลบหน่วยสินค้าสำเร็จ' });
    } catch (error) {
        console.error('Error deleting unit:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};
