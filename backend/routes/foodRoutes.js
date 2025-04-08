const express = require('express');
const router = express.Router();
const { upload, createFood, updateFood, deleteFood, getFoods, getFoodById} = require('../controllers/foodsController');
const drinkController = require('../controllers/drinkController');
const orderControllor = require('../controllers/orderController');
const paymentControllor = require('../controllers/paymentController')
const receiptControllor = require('../controllers/receiptController')

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
// router.get('/getPendingOrdersByCustomerHis/:id', orderControllor.getPendingOrdersByCustomerHis)

//ดึงข้อมูลรายการอาหารที่กำลังดำเนินการ
router.get('/getInProgressOrdersByCustomer/:id', orderControllor.getInProgressOrdersByCustomer)
router.get('/getCompletedOrdersByCustomer/:id', orderControllor.getCompletedOrdersByCustomer)
router.get('/getCancelledByCustomer/:id', orderControllor.getCancelledByCustomer)

router.get('/getPendingOrdersByCustomerOrEmployee/:id', orderControllor.getPendingOrdersByCustomerOrEmployee)
router.get('/getInProgressOrdersByCustomerOrEmployee/:id', orderControllor.getInProgressOrdersByCustomerOrEmployee)
router.get('/getCompletedOrdersByCustomerOrEmployee/:id', orderControllor.getCompletedOrdersByCustomerOrEmployee)
router.get('/getCancelledByCustomerOrEmployee/:id', orderControllor.getCancelledByCustomerOrEmployee)



//ดึงข้อมูลอาหารโดยพนักงาน
router.get('/getPendingOrdersByEmployee/:_id', orderControllor.getPendingOrdersByEmployee)

// ลูกค้าชำระเงิน รอแคชเชียร์ทำการชำระเงิน
router.post('/createPaymentOrderCustomer', orderControllor.createPaymentOrderCustomer)
//ลูกค้าดึงรายการที่สำเร็จ





router.get('/getPaymentsByOrder/:orderId', paymentControllor.getPaymentsByOrder)



//แคชเชียร์ดึงข้อมูลรายการลูกค้าที่ต้องชำระ
router.get('/getpaymentorderByCashier', paymentControllor.getpaymentorderByCashier)
router.get('/getpaymentorderByCashierFinish', paymentControllor.getpaymentorderByCashierFinish)

//อัพเดตรายการอาหาร
router.put('/updateQuantityFood/:_id', paymentControllor.updateQuantityFood)
router.put('/updateQuantityDrink/:_id', paymentControllor.updateQuantityDrink)

//แคชเชียร์ยืนยันการชำระเงิน
router.put('/updatePaymentCutomer/:id', paymentControllor.updatePaymentCutomer)

router.get('/getReceipt/:id', receiptControllor.getReceipt)







module.exports = router;
