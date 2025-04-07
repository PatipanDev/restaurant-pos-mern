const Product = require('../models/Product');
const Foodrecipe = require('../models/FoodRecipe'); // เปลี่ยนเป็น Foodrecipe
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// เพิ่มสูตรอาหารใหม่
// เพิ่มสูตรอาหารใหม่
exports.addFoodRecipe = async (req, res) => {
  const { recipes_Quantity, recipes_Price, food_Id, product_Id } = req.body;

  try {
    // ตรวจสอบว่าใน food_Id นี้มี product_Id ที่เหมือนกันหรือไม่
    const existingRecipe = await Foodrecipe.findOne({ food_Id, product_Id });

    if (existingRecipe) {
      return res.status(400).json({
        message: 'ไม่สามารถเพิ่มสูตรอาหารได้ เนื่องจากมีอยู่แล้วใน',
      });
    }

    // สร้างสูตรอาหารใหม่
    const foodRecipe = new Foodrecipe({
      recipes_Quantity,
      recipes_Price,
      food_Id,
      product_Id,
    });

    // บันทึกสูตรอาหารในฐานข้อมูล
    await foodRecipe.save();

    res.status(201).json({
      _id: foodRecipe._id,
      recipes_Quantity: foodRecipe.recipes_Quantity,
      recipes_Price: foodRecipe.recipes_Price,
      food_Id: foodRecipe.food_Id,
      product_Id: foodRecipe.product_Id,
      message: 'เพิ่มสูตรอาหารใหม่สำเร็จ',
    });
  } catch (error) {
    console.error('Error during Foodrecipe registration:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดขณะเพิ่มสูตรอาหาร',
      error: error.message || error,
    });
  }
};


// ดึงข้อมูลสูตรอาหารทั้งหมด
exports.getFoodRecipes = async (req, res) => {
  try {
    const foodRecipes = await Foodrecipe.find()
      .populate('food_Id')
      .populate('product_Id'); // ดึงข้อมูลอาหารและสินค้า

    res.status(200).json(foodRecipes);
  } catch (error) {
    console.error('Error fetching food recipes:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

// อัปเดตสูตรอาหาร
exports.updateFoodRecipe = async (req, res) => {
  const { id } = req.params;
  const { recipes_Quantity, recipes_Price, food_Id, product_Id } = req.body;

  try {
    const foodRecipe = await Foodrecipe.findById(id);
    if (!foodRecipe) {
      return res.status(404).json({ message: 'ไม่พบสูตรอาหาร' });
    }

    // อัปเดตเฉพาะค่าที่มีการเปลี่ยนแปลง
    foodRecipe.recipes_Quantity = recipes_Quantity ?? foodRecipe.recipes_Quantity;
    foodRecipe.recipes_Price = recipes_Price ?? foodRecipe.recipes_Price;
    foodRecipe.food_Id = food_Id ?? foodRecipe.food_Id;
    foodRecipe.product_Id = product_Id ?? foodRecipe.product_Id;

    await foodRecipe.save();

    res.status(200).json({
      message: 'อัปเดตข้อมูลสูตรอาหารสำเร็จ',
      updatedFoodRecipe: foodRecipe,
    });
  } catch (error) {
    console.error('❌ Error updating food recipe:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสูตรอาหาร', error: error.message });
  }
};

// ลบสูตรอาหาร
exports.deleteFoodRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const foodRecipe = await Foodrecipe.findById(id);
    if (!foodRecipe) {
      return res.status(404).json({ message: 'ไม่พบสูตรอาหาร' });
    }

    await foodRecipe.deleteOne();

    res.status(200).json({ message: 'ลบข้อมูลสูตรอาหารสำเร็จ' });
  } catch (error) {
    console.error('❌ Error deleting food recipe:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบสูตรอาหาร', error: error.message });
  }
};



exports.getFoodRecipesByFoodId = async (req, res) => {
  const { id } = req.params;

  try {
    // ใช้ find แทน findOne เพื่อดึงข้อมูลหลายอัน
    const foodRecipes = await Foodrecipe.find({ food_Id: id })
      .populate('food_Id')  // เชื่อมโยงกับข้อมูลใน food_Id
      .populate({
        path: 'product_Id',
        populate: {
          path: 'unitId',
          select: 'unit_Name' // เลือกเฉพาะ field ที่ต้องการ เช่น unit_Name
        }
      });
    const product = await Product.find()
      .populate('unitId')
      .populate('categoryId')

    res.status(200).json({
      foodRecipes,
      product
    });
  } catch (error) {
    console.error('Error fetching food recipes by foodId:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};


