const express = require('express');
const router = express.Router();
const { upload, createFood, updateFood, deleteFood, getFoods} = require('../controllers/foodsController');

// เส้นทางสำหรับเพิ่มข้อมูล (POST)
router.post('/createFood', upload.single('food_Image'), createFood);

// เส้นทางสำหรับอัปเดตข้อมูล (PUT)
router.put('/updateFood/:id', upload.single('food_Image'), updateFood);

router.delete('/deleteFood/:id', deleteFood);

router.get('/getfoods', getFoods);

module.exports = router;
