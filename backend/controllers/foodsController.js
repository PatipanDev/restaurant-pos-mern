const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // เพิ่ม sharp สำหรับบีบอัดรูปภาพ
const fs = require('fs').promises; // เพิ่ม fs.promises สำหรับจัดการไฟล์แบบ async
const Food = require('../models/Food');

// กำหนดที่เก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/image'); // เก็บไฟล์ไว้ในโฟลเดอร์ uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์เป็น timestamp
  },
});

const upload = multer({ storage: storage });

// สร้าง controller สำหรับเพิ่มข้อมู

// สร้าง controller สำหรับเพิ่มข้อมูล
const createFood = async (req, res) => {
  try {
    const { food_Name, food_Stock, food_Price, product_Category_Id, owner_Id, chef_Id } = req.body;
    const originalImagePath = req.file ? req.file.path : null;

    if (originalImagePath) {
      const compressedImagePath = path.join(
        path.dirname(originalImagePath),
        'compressed-' + path.basename(originalImagePath, path.extname(originalImagePath)) + '.webp'
      );

      await sharp(originalImagePath)
        .resize({ width: 800 })
        .webp({ quality: 80 })
        .toFile(compressedImagePath);

      await fs.unlink(originalImagePath);

      // เก็บชื่อไฟล์ที่บีบอัดแทน
      req.file.filename = path.basename(compressedImagePath);
    }

    // เก็บเฉพาะชื่อไฟล์ที่บีบอัด
    const food_Image = req.file ? req.file.filename : null;
    const chefIdToSave = (chef_Id === "" || chef_Id === undefined) ? null : chef_Id;

    const foodData = new Food({
      food_Name,
      food_Stock,
      food_Price,
      product_Category_Id,
      owner_Id,
      chef_Id: chefIdToSave,
      food_Image,
    });

    await foodData.save();

    res.status(200).json({
      message: 'เพิ่มข้อมูลสำเร็จ',
      data: foodData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' });
  }
};





const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { food_Name, food_Stock, food_Price, product_Category_Id, owner_Id, chef_Id } = req.body;
    const originalImagePath = req.file ? req.file.path : null;

    if (originalImagePath) {
      const compressedImagePath = path.join(
        path.dirname(originalImagePath),
        'compressed-' + path.basename(originalImagePath, path.extname(originalImagePath)) + '.webp'
      );

      await sharp(originalImagePath)
        .resize({ width: 800 })
        .webp({ quality: 80 })
        .toFile(compressedImagePath);

      await fs.unlink(originalImagePath);

      // เก็บชื่อไฟล์ที่บีบอัดแทน
      req.file.filename = path.basename(compressedImagePath);
    }

    // เก็บเฉพาะชื่อไฟล์ที่บีบอัด
    const food_Image = req.file ? req.file.filename : null;
    const chefIdToSave = (chef_Id === "" || chef_Id === undefined) ? null : chef_Id;

    // ดึงข้อมูลอาหารเก่าจากฐานข้อมูล
    const oldFoodData = await Food.findById(id);

    // ตรวจสอบว่ามีรูปภาพเก่าหรือไม่ และลบออก
    if (oldFoodData && oldFoodData.food_Image) {
      if (food_Image) { // ถ้ามีการส่งภาพมาใหม่ให้ลบภาพเก่า
        try {
          await fs.unlink(path.join('uploads/image', oldFoodData.food_Image));
        } catch (unlinkError) {
          console.error('Error deleting old image:', unlinkError);
        }
      }
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      {
        food_Name,
        food_Stock,
        food_Price,
        product_Category_Id,
        owner_Id,
        chef_Id: chefIdToSave,
        food_Image: food_Image || oldFoodData.food_Image, // ใช้รูปภาพใหม่ถ้ามี ไม่เช่นนั้นใช้รูปภาพเก่า
      },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลอาหาร' });
    }

    res.status(200).json({
      message: 'อัปเดตข้อมูลสำเร็จ',
      data: updatedFood,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
};




const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    // ดึงข้อมูลอาหารที่จะลบ
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลอาหาร' });
    }

    // ลบรูปภาพ (ถ้ามี) โดยใช้ชื่อไฟล์ที่เก็บในฐานข้อมูล
    if (food.food_Image) {
      const imagePath = path.join('uploads/image', food.food_Image);
      try {
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error('Error deleting image:', unlinkError);
      }
    }

    // ลบข้อมูลอาหารจากฐานข้อมูล
    await Food.findByIdAndDelete(id);

    res.status(200).json({ message: 'ลบข้อมูลอาหารสำเร็จ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลอาหาร' });
  }
};

const getFoods = async (req, res) => {
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

module.exports = {
  upload,
  createFood,
  updateFood,
  deleteFood,
  getFoods
};


