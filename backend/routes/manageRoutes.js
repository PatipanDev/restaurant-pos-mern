const express = require('express');
const router = express.Router();
const productCategoryControllers = require('../controllers/productCategoryControllers');
const productsControllers = require('../controllers/productController');
const unitControllers = require('../controllers/unitControllers');
const tableControllers = require('../controllers/tableController'); // เปลี่ยนเป็น tableControllers
const drinkControllers = require('../controllers/drinkController');
const foodCetagoryControllers = require('../controllers/foodCategoryControllers');
const ingredientsControllers = require('../controllers/ingredientsController');
const ingrediendetailsControllers = require('../controllers/ingredientDetControoller');
const foodrecipeControllers = require('../controllers/foodrecipeController');
const suppilerController = require('../controllers/suppilerController')



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



//ประเภทอาหาร 
router.get('/getfoodcategory', foodCetagoryControllers.getCategories)

router.post('/createfoodcategory', foodCetagoryControllers.createCategory)

router.put('/updatefoodcategory/:id', foodCetagoryControllers.updateCategory);

router.delete('/deletefoodcategory/:id', foodCetagoryControllers.deleteCategory);


//เตรียมวัตุถุดิบ 
router.get('/getingredients',ingredientsControllers.getIngredients);

router.post('/createingredients', ingredientsControllers.addIngredient);

router.put('/updateingredients/:id', ingredientsControllers.updateIngredient);

router.delete('/deleteingredients/:id', ingredientsControllers.deleteIngredient);


//รายละเอียดการเตรียม
router.get('/getIngredientDetails/:id', ingrediendetailsControllers.getIngredientDetailsByIngredientId)

router.post('/addIngredientDetail', ingrediendetailsControllers.addIngredientDetail)

router.put('/updateIngredientDetail/:id', ingrediendetailsControllers.updateIngredientDetail)

router.delete('/deleteIngredientDetail/:id', ingrediendetailsControllers.deleteIngredientDetail)

// router.put('/updateNewProduct/:id', ingrediendetailsControllers.updateNewProduct)

//จัดการสูตรอาหาร
router.get('/getFoodRecipes/:id', foodrecipeControllers.getFoodRecipesByFoodId)

router.post('/addFoodRecipe', foodrecipeControllers.addFoodRecipe)

router.put('/updateFoodRecipe/:id', foodrecipeControllers.updateFoodRecipe)

router.delete('/deleteFoodRecipe/:id', foodrecipeControllers.deleteFoodRecipe)

//ดึงข้อมูลร้านค้า
router.get('/getSuppliers', suppilerController.getSupplier)


module.exports = router;
