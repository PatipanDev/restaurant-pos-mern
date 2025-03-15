const Food = require('../models/Food');
const express = require('express');
require('dotenv').config();

// เพิ่มอาหารใหม่
exports.addFood = async (req, res) => {
  const { food_Name, food_Stock, food_Price, product_Category_Id, chef_Id, owner_Id } = req.body;

  try {
    // ตรวจสอบว่าอาหารนี้มีอยู่ในหมวดหมู่เดียวกันหรือไม่
    let food = await Food.findOne({ food_Name, product_Category_Id });
    if (food) {
      return res.status(400).json({ message: 'อาหารนี้มีอยู่แล้วในหมวดหมู่เดียวกัน' });
    }

    // สร้างอาหารใหม่
    food = new Food({
      food_Name,
      food_Stock,
      food_Price,
      product_Category_Id,
      chef_Id,
      owner_Id,
    });

    // บันทึกอาหารในฐานข้อมูล
    await food.save();

    res.status(201).json({
      _id: food._id,
      food_Name: food.food_Name,
      food_Stock: food.food_Stock,
      food_Price: food.food_Price,
      product_Category_Id: product_Category_Id,
      chef_Id: food.chef_Id,
      owner_Id: food.owner_Id,
      message: 'เพิ่มอาหารใหม่สำเร็จ',
    });
  } catch (error) {
    console.error("Error during Food registration:", error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดขณะเพิ่มอาหาร',
      error: error.message || error,
    });
  }
};

// ดึงข้อมูลอาหารทั้งหมด
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate(['product_Category_Id', 'chef_Id', 'owner_Id']);

    // ✅ แปลง food_Price เป็น string
    const formattedFoods = foods.map(food => ({
      ...food.toObject(),
      food_Price: food.food_Price.toString(), // แปลง Decimal128 เป็น String
    }));

    res.status(200).json(formattedFoods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};


// อัปเดตอาหาร
exports.updateFood = async (req, res) => {
  const { id } = req.params;
  const { food_Name, food_Stock, food_Price, product_Category, chef_Id, owner_Id } = req.body;

  try {
    const food = await Food.findByIdAndUpdate(
      id,
      { food_Name, food_Stock, food_Price, product_Category, chef_Id, owner_Id },
      { new: true } // คืนค่าใหม่ที่อัปเดต
    );

    if (!food) return res.status(404).json({ message: 'ไม่พบอาหาร' });

    res.status(200).json({ message: 'อัปเดตข้อมูลอาหารสำเร็จ' });
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตอาหาร' });
  }
};

// ลบอาหาร
exports.deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({ message: 'ไม่พบอาหาร' });
    }

    res.status(200).json({ message: 'ลบข้อมูลอาหารสำเร็จ' });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบอาหาร' });
  }
};