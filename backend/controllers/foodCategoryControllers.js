const express = require('express');
const Foodcategory = require('../models/Foodcategory'); // ปรับ path ตามโครงสร้างของคุณ

// สร้าง Foodcategory ใหม่
exports.createCategory = async (req, res) => {
  const { category_name, description } = req.body;

  try {
    // ตรวจสอบว่าชื่อประเภทซ้ำหรือไม่
    let category = await Foodcategory.findOne({ category_name });
    if (category) {
      return res.status(400).json({ message: 'ชื่อประเภทสินค้านี้มีอยู่แล้ว' });
    }

    // สร้าง Foodcategory ใหม่
    category = new Foodcategory({ category_name, description });

    // บันทึกข้อมูลลงฐานข้อมูล
    await category.save();

    res.status(201).json({
      _id: category._id,
      category_name: category.category_name,
      description: category.description,
      message: 'เพิ่มประเภทสินค้าสำเร็จ',
    });
  } catch (error) {
    console.error('Error during category creation:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดขณะเพิ่มประเภทสินค้า',
      error: error.message || error,
    });
  }
};

// ดึงข้อมูล Foodcategory ทั้งหมด
exports.getCategories = async (req, res) => {
  try {
    const categories = await Foodcategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

// อัปเดต Foodcategory
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name, description } = req.body;

  try {
    const category = await Foodcategory.findById(id);
    if (!category) return res.status(404).json({ message: 'ไม่พบประเภทสินค้า' });

    // อัปเดตชื่อประเภทสินค้าและคำอธิบาย
    category.category_name = category_name;
    category.description = description;

    await category.save();

    res.status(200).json({ message: 'อัปเดตประเภทสินค้าสำเร็จ' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
};

// ลบ Foodcategory
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Foodcategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'ไม่พบประเภทสินค้า' });
    }

    res.status(200).json({ message: 'ลบประเภทสินค้าสำเร็จ' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};