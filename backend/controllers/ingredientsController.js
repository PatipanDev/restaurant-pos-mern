const Ingredient = require('../models/Ingredient');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// เพิ่มส่วนผสมใหม่
exports.addIngredient = async (req, res) => {
  const { ingredient_Name, ingredient_Quantity, ingredient_Steps, ingredient_Exdate, chef_Id } = req.body;

  try {
    // ตรวจสอบว่าส่วนผสมนี้มีชื่อซ้ำกันหรือไม่
    let ingredient = await Ingredient.findOne({ ingredient_Name });
    if (ingredient) {
      return res.status(400).json({ message: 'ส่วนผสมนี้มีชื่อซ้ำกัน' });
    }

    // สร้างส่วนผสมใหม่
    ingredient = new Ingredient({
      ingredient_Name,
      ingredient_Quantity,
      ingredient_Steps,
      ingredient_Exdate,
      chef_Id,
    });

    // บันทึกส่วนผสมในฐานข้อมูล
    await ingredient.save();

    res.status(201).json({
      _id: ingredient._id,
      ingredient_Name: ingredient.ingredient_Name,
      ingredient_Quantity: ingredient.ingredient_Quantity,
      ingredient_Steps: ingredient.ingredient_Steps,
      ingredient_Exdate: ingredient.ingredient_Exdate,
      chef_Id: ingredient.chef_Id,
      message: 'เพิ่มส่วนผสมใหม่สำเร็จ',
    });
  } catch (error) {
    console.error("Error during Ingredient registration:", error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดขณะเพิ่มส่วนผสม',
      error: error.message || error,
    });
  }
};

// ดึงข้อมูลส่วนผสมทั้งหมด
exports.getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().populate('chef_Id'); // ดึงข้อมูลเชฟ

    res.status(200).json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

// อัปเดตส่วนผสม
exports.updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { ingredient_Name, ingredient_Quantity, ingredient_Steps, ingredient_Exdate, chef_Id } = req.body;

  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { ingredient_Name, ingredient_Quantity, ingredient_Steps, ingredient_Exdate, chef_Id },
      { new: true } // คืนค่าใหม่ที่อัปเดต
    );

    if (!ingredient) return res.status(404).json({ message: 'ไม่พบส่วนผสม' });

    res.status(200).json({ message: 'อัปเดตข้อมูลส่วนผสมสำเร็จ' });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตส่วนผสม' });
  }
};

// ลบส่วนผสม
exports.deleteIngredient = async (req, res) => {
  const { id } = req.params;

  try {
    const ingredient = await Ingredient.findByIdAndDelete(id);

    if (!ingredient) {
      return res.status(404).json({ message: 'ไม่พบส่วนผสม' });
    }

    res.status(200).json({ message: 'ลบข้อมูลส่วนผสมสำเร็จ' });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบส่วนผสม' });
  }
};