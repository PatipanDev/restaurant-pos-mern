const Drink = require('../models/Drink');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// เพิ่มเครื่องดื่มใหม่
exports.addDrink = async (req, res) => {
    const { drink_Name, drink_Price, drink_Quantity, drink_Stock_quantity, drink_Manufacture_date, drink_Expiry_date } = req.body;

    try {
        // ตรวจสอบว่าเครื่องดื่มนี้มีอยู่แล้วหรือไม่
        let drink = await Drink.findOne({ drink_Name });
        if (drink) {
            return res.status(400).json({ message: 'เครื่องดื่มนี้มีอยู่แล้ว' });
        }

        // สร้างเครื่องดื่มใหม่
        drink = new Drink({
            drink_Name,
            drink_Price,
            drink_Quantity,
            drink_Stock_quantity,
            drink_Manufacture_date,
            drink_Expiry_date,
        });

        // บันทึกเครื่องดื่มในฐานข้อมูล
        await drink.save();

        res.status(201).json({
            _id: drink._id,
            drink_Name: drink.drink_Name,
            drink_Price: drink.drink_Price,
            drink_Quantity: drink.drink_Quantity,
            drink_Stock_quantity: drink.drink_Stock_quantity,
            drink_Manufacture_date: drink.drink_Manufacture_date,
            drink_Expiry_date: drink.drink_Expiry_date,
            message: 'เพิ่มเครื่องดื่มใหม่สำเร็จ'
        });
    } catch (error) {
        console.error("Error during Drink registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะเพิ่มเครื่องดื่ม',
            error: error.message || error
        });
    }
};

// ดึงข้อมูลเครื่องดื่มทั้งหมด
exports.getDrinks = async (req, res) => {
    try {
        const drinks = await Drink.find(); // ดึงข้อมูลเครื่องดื่มทั้งหมด

        res.status(200).json(drinks);
    } catch (error) {
        console.error("Error fetching drinks:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// อัปเดตเครื่องดื่ม
exports.updateDrink = async (req, res) => {
    const { id } = req.params;
    const { drink_Name, drink_Price, drink_Quantity, drink_Stock_quantity, drink_Manufacture_date, drink_Expiry_date} = req.body;

    try {
        const drink = await Drink.findByIdAndUpdate(
            id,
            { drink_Name, drink_Price, drink_Quantity, drink_Stock_quantity, drink_Manufacture_date, drink_Expiry_date},
            { new: true } // คืนค่าใหม่ที่อัปเดต
        );

        if (!drink) return res.status(404).json({ message: 'ไม่พบเครื่องดื่ม' });

        res.status(200).json({ message: 'อัปเดตข้อมูลเครื่องดื่มสำเร็จ' });
    } catch (error) {
        console.error('Error updating drink:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตเครื่องดื่ม' });
    }
};

// ลบเครื่องดื่ม
exports.deleteDrink = async (req, res) => {
    const { id } = req.params;

    try {
        const drink = await Drink.findByIdAndDelete(id);

        if (!drink) {
            return res.status(404).json({ message: 'ไม่พบเครื่องดื่ม' });
        }

        res.status(200).json({ message: 'ลบข้อมูลเครื่องดื่มสำเร็จ' });
    } catch (error) {
        console.error('Error deleting drink:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบเครื่องดื่ม' });
    }
};