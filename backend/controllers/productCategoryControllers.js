const ProductCategory = require('../models/productCategory'); // ใช้โมเดล ProductCategory
const express = require('express'); // เพิ่พิ่มบรรทัดนี้
require('dotenv').config();

// สร้างประเภทสินค้าใหม่
exports.createCategory = async (req, res) => {
    const { category_name } = req.body;

    try {
        // ตรวจสอบว่าชื่อประเภทซ้ำหรือไม่
        let category = await ProductCategory.findOne({ category_name });
        if (category) {
            return res.status(400).json({ message: 'ชื่อประเภทสินค้านี้มีอยู่แล้ว' });
        }

        // สร้างประเภทสินค้าใหม่
        category = new ProductCategory({ category_name });

        // บันทึกข้อมูลลงฐานข้อมูล
        await category.save();

        res.status(201).json({ 
            _id: category._id,
            category_name: category.category_name,
            message: 'เพิ่มประเภทสินค้าสำเร็จ' 
        });
    } catch (error) {
        console.error("Error during category creation:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะเพิ่มประเภทสินค้า',
            error: error.message || error
        });
    }
};

// ดึงข้อมูลประเภทสินค้าทั้งหมด
exports.getCategories = async (req, res) => {
    try {
        const categories = await ProductCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// อัปเดตประเภทสินค้า
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    try {
        const category = await ProductCategory.findById(id);
        if (!category) return res.status(404).json({ message: 'ไม่พบประเภทสินค้า' });

        // อัปเดตชื่อประเภทสินค้า
        category.category_name = category_name;

        await category.save();

        res.status(200).json({ message: 'อัปเดตประเภทสินค้าสำเร็จ' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

// ลบประเภทสินค้า
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await ProductCategory.findByIdAndDelete(id);
        
        if (!category) {
            return res.status(404).json({ message: 'ไม่พบประเภทสินค้า' });
        }

        res.status(200).json({ message: 'ลบประเภทสินค้าสำเร็จ' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};
