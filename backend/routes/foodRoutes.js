const express = require('express');
const router = express.Router();
const { upload, createFood, updateFood, deleteFood, getFoods, getFoodById} = require('../controllers/foodsController');
const drinkController = require('../controllers/drinkController');
const orderControllor = require('../controllers/orderController')

// เส้นทางสำหรับเพิ่มข้อมูล (POST)
router.post('/createFood', upload.single('food_Image'), createFood);

// เส้นทางสำหรับอัปเดตข้อมูล (PUT)
router.put('/updateFood/:id', upload.single('food_Image'), updateFood);

router.delete('/deleteFood/:id', deleteFood);

router.get('/getfoods', getFoods);

router.get('/getFoodById/:id', getFoodById);




router.get('/getDrinks', drinkController.getDrinks);

router.get('/getDrinkById/:id', drinkController.getDrinkById);

router.post('/createDrink', drinkController.upload.single('drink_Image'), drinkController.createDrink);

router.put('/updateDrink/:id', drinkController.upload.single('drink_Image'), drinkController.updateDrink)

router.delete('/deleteDrink/:id', drinkController.deleteDrink);


//OrderFoodDetail
router.post('/createOrderFoodDetail', orderControllor.createOrderFoodDetail)
//OrderDrinkDetail
router.post('/createOrderDrinkDetail', orderControllor.createOrderDrinkDetail)


//ดึงข้อมูลรายการอาหารของลูกค้า ตามไอดีแต่ละคน
router.get('/getPendingOrdersByCustomer/:id', orderControllor.getPendingOrdersByCustomer)
//ดึงข้อมูลรายการอาหารที่กำลังดำเนินการ
router.get('/getInProgressOrdersByCustomer/:id', orderControllor.getInProgressOrdersByCustomer)

//ดึงข้อมูลอาหารโดยพนักงาน
router.get('/getPendingOrdersByEmployee/:_id', orderControllor.getPendingOrdersByEmployee)







module.exports = router;
