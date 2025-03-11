const express = require('express');
const router = express.Router();
const productCategoryControllers = require('../controllers/productCategoryControllers');
const productsControllers = require('../controllers/productController');
const unitControllers = require('../controllers/unitControllers');
const tableControllers = require('../controllers/tableController'); // เปลี่ยนเป็น tableControllers
const drinkControllers = require('../controllers/drinkController');
const foodsControllers = require('../controllers/foodsController');
const foodCetagoryControllers = require('../controllers/foodCategoryControllers');



// / ประเเภทสินค้า
router.get('/getcategories',productCategoryControllers.getCategories)

router.post('/createcategory',productCategoryControllers.createCategory)

router.put('/updatecategory/:id', productCategoryControllers.updateCategory)

router.delete('/deletecategory/:id', productCategoryControllers.deleteCategory)


// ดึงข้อมูลหน่วยสินค้าทั้งหมด
router.get('/getunits', unitControllers.getUnits);

// สร้างหน่วยสินค้าใหม่
router.post('/createunit', unitControllers.createUnit);

// อัปเดตหน่วยสินค้า
router.put('/updateunit/:id', unitControllers.updateUnit);

// ลบหน่วยสินค้า
router.delete('/deleteunit/:id', unitControllers.deleteUnit);


// / สินค้า 
router.post('/addproduct',productsControllers.addProduct)

router.get('/getproducts', productsControllers.getProducts)  

router.put('/updateproduct/:id', productsControllers.updateProduct)

router.delete('/deleteproduct/:id',productsControllers.deleteProduct)





// ดึงข้อมูลโต๊ะทั้งหมด
router.get('/gettables', tableControllers.getTables);

// สร้างโต๊ะใหม่
router.post('/createtable', tableControllers.registerTable);

// อัปเดตข้อมูลโต๊ะ
router.put('/updatetable/:id', tableControllers.updateTable);

// ลบโต๊ะ
router.delete('/deletetable/:id', tableControllers.deleteTable);





// ดึงข้อมูลเครื่องดื่มทั้งหมด
router.get('/getDrinks', drinkControllers.getDrinks);

// สร้างเครื่องดื่มใหม่
router.post('/addDrink', drinkControllers.addDrink);

// อัปเดตเครื่องดื่ม
router.put('/updateDrink/:id', drinkControllers.updateDrink);

// ลบเครื่องดื่ม
router.delete('/deleteDrink/:id', drinkControllers.deleteDrink);




// ดึงข้อมูลประเภทอาหารทั้งหมด
router.get('/getfoods', foodsControllers.getFoods);

// สร้างประเภทอาหารใหม่
router.post('/postfoods', foodsControllers.addFood);

// อัปเดตประเภทอาหาร
router.put('/updatefoods/:id', foodsControllers.updateFood);

// ลบประเภทอาหาร
router.delete('/deletefoods/:id', foodsControllers.deleteFood);




//ประเภทอาหาร 
// router.get('/getfoodcategory', foodCetagoryControllers.getCategories)

router.post('/createfoodcategory', foodCetagoryControllers.createCategory)

// router.put('/updatefoodcategory/:id', foodCetagoryControllers.updateCategory);

// router.delete('/deletefoodcategory/:id', foodCetagoryControllers.deleteCategory);

module.exports = router;
