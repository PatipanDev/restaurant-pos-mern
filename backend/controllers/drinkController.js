const Drink = require('../models/Drink');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs-extra');  // ใช้ fs-extra สำหรับการจัดการไฟล์
const fsp = require('fs').promises; // เก็บ fs.promises ไว้ใน fsp

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/drink-images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

exports.upload = multer({ storage: storage });

const compressImage = async (originalImagePath) => {
    const compressedImagePath = path.join(
        path.dirname(originalImagePath),
        'compressed-' + path.basename(originalImagePath, path.extname(originalImagePath)) + '.webp'
    );

    try {
        // ใช้ sharp สำหรับบีบอัดภาพ
        await sharp(originalImagePath)
            .resize({ width: 800 })  // ปรับขนาดภาพ
            .webp({ quality: 80 })  // แปลงเป็น .webp และบีบอัด
            .toFile(compressedImagePath);  // บันทึกไฟล์ที่บีบอัดแล้ว
        return compressedImagePath;  // คืนค่าพาธของไฟล์ที่บีบอัดแล้ว
    } catch (error) {
        console.error('ไม่สามารถบีบอัดภาพได้:', error);
        throw error;
    }
};

// ฟังก์ชันสำหรับลบไฟล์
const deleteFile = async (filePath) => {
    try {
        await fs.remove(filePath);  // ใช้ fs-extra เพื่อลบไฟล์
        console.log('ไฟล์ถูกลบสำเร็จ');
    } catch (error) {
        console.error('ไม่สามารถลบไฟล์:', error);
    }
};

exports.createDrink = async (req, res) => {
    try {
        // ดึงข้อมูลจาก body
        const { 
            drink_Name, 
            drink_Price, 
            drink_Quantity, 
            drink_Stock_quantity, 
            drink_Manufacture_date, 
            drink_Expiry_date 
        } = req.body;

        const originalImagePath = req.file ? req.file.path : null;  // ดึงพาธของไฟล์ภาพ

        if (originalImagePath) {
            const compressedImagePath = await compressImage(originalImagePath);  // บีบอัดภาพ

            // ถ้าบีบอัดภาพสำเร็จแล้ว ลบไฟล์ต้นฉบับ
            if (compressedImagePath) {
                await deleteFile(originalImagePath);  // ลบไฟล์ต้นฉบับ
                req.file.filename = path.basename(compressedImagePath);  // เปลี่ยนชื่อไฟล์ใน req.file
            } else {
                console.error('ไม่สามารถสร้างไฟล์ที่บีบอัดได้');
                return res.status(500).json({ message: 'ไม่สามารถบีบอัดไฟล์ได้' });
            }
        } else {
            console.log('ไม่มีไฟล์ถูกอัปโหลด');
        }

        const drink_Image = req.file ? req.file.filename : null;  // ถ้ามีไฟล์ให้ใช้ชื่อไฟล์ที่ถูกบีบอัด

        // สร้างข้อมูลเครื่องดื่มใหม่
        const drinkData = new Drink({
            drink_Name,
            drink_Price,
            drink_Quantity,
            drink_Stock_quantity,
            drink_Manufacture_date,
            drink_Expiry_date,
            drink_Image,
        });

        // บันทึกข้อมูลลงในฐานข้อมูล
        await drinkData.save();

        // ส่ง Response กลับไป
        res.status(200).json({
            message: 'เพิ่มข้อมูลเครื่องดื่มสำเร็จ',
            data: drinkData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลเครื่องดื่ม' });
    }
};


exports.updateDrink = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            drink_Name,
            drink_Price,
            drink_Quantity,
            drink_Stock_quantity,
            drink_Manufacture_date,
            drink_Expiry_date,
        } = req.body;
        const originalImagePath = req.file ? req.file.path : null;

        let drink_Image = null; // ค่าเริ่มต้นของ drink_Image

        // ดึงข้อมูลเครื่องดื่มเก่า
        const oldDrinkData = await Drink.findById(id);
        if (!oldDrinkData) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลเครื่องดื่ม' });
        }

        if (originalImagePath) {
            const compressedImagePath = path.join(
                path.dirname(originalImagePath),
                `compressed-${Date.now()}.webp`
            );

            await sharp(originalImagePath)
                .resize({ width: 800 })
                .webp({ quality: 80 })
                .toFile(compressedImagePath);

            await fsp.unlink(originalImagePath); // ลบไฟล์ต้นฉบับ

            drink_Image = path.basename(compressedImagePath); // ใช้ไฟล์ที่บีบอัด

            // ลบไฟล์เก่าถ้ามี
            if (oldDrinkData.drink_Image) {
                const oldImagePath = path.join('uploads/drink-images', oldDrinkData.drink_Image);
                try {
                    if (fs.existsSync(oldImagePath)) {
                        await fsp.unlink(oldImagePath);
                    }
                } catch (unlinkError) {
                    console.error('ไม่สามารถลบไฟล์เก่าได้:', unlinkError);
                }
            }
        } else {
            drink_Image = oldDrinkData.drink_Image; // ใช้ภาพเดิมถ้าไม่มีการอัปโหลดใหม่
        }

        // อัปเดตข้อมูล
        const updatedDrink = await Drink.findByIdAndUpdate(
            id,
            {
                drink_Name,
                drink_Price,
                drink_Quantity,
                drink_Stock_quantity,
                drink_Manufacture_date,
                drink_Expiry_date,
                drink_Image,
            },
            { new: true }
        );

        res.status(200).json({
            message: 'อัปเดตข้อมูลเครื่องดื่มสำเร็จ',
            data: updatedDrink,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลเครื่องดื่ม' });
    }
};


// ดึงข้อมูลเครื่องดื่มทั้งหมด



// ลบเครื่องดื่ม
exports.deleteDrink = async (req, res) => {
    try {
        const { id } = req.params;

        // ดึงข้อมูลเครื่องดื่มที่จะลบ
        const drink = await Drink.findById(id);

        if (!drink) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลเครื่องดื่ม' });
        }

        // ลบรูปภาพ (ถ้ามี) โดยใช้ชื่อไฟล์ที่เก็บในฐานข้อมูล
        if (drink.drink_Image) {
            const imagePath = path.join('uploads/drink-images', drink.drink_Image); // เปลี่ยน path ตามโฟลเดอร์เก็บรูป
            try {
                await fsp.unlink(imagePath);
            } catch (unlinkError) {
                console.error('Error deleting image:', unlinkError);
            }
        }

        // ลบข้อมูลเครื่องดื่มจากฐานข้อมูล
        await Drink.findByIdAndDelete(id);

        res.status(200).json({ message: 'ลบข้อมูลเครื่องดื่มสำเร็จ' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลเครื่องดื่ม' });
    }
};


exports.getDrinks = async (req, res) => {
    try {
        const drinks = await Drink.find(); // ดึงข้อมูลเครื่องดื่มทั้งหมด

        res.status(200).json(drinks);
    } catch (error) {
        console.error("Error fetching drinks:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

exports.getDrinkById = async (req, res) => {
    try {
      const drink = await Drink.findById(req.params.id);
      if (!drink) {
        return res.status(404).json({ message: 'ไม่พบเครื่องดื่ม' });
      }
  
      // แปลง Decimal128 เป็น Number หรือ String
      const formattedDrink = {
        ...drink.toObject(),
        drink_Price: parseFloat(drink.drink_Price.toString()), // ✅ แปลงเป็นตัวเลข
      };
  
      res.status(200).json(formattedDrink);
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
  };
  