const express = require('express');
const router = express.Router();
const productCategoryControllers = require('../controllers/productCategoryControllers')
const productsControllers = require('../controllers/productController')
const unitControllers = require('../controllers/unitControllers')


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


/// สินค้า 
// router.post('/addproduct',productsControllers.addproduct)

// router.get('/getproduct', productsControllers.getProducts)

// router.put('/updateproduct/:id', productsControllers.updateproduct)

// router.delete('/deleteproduct/:id',productsControllers.deleteproduct)

module.exports = router