const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authEmController = require('../controllers/authEmController')
const authCasController = require('../controllers/authCasController')
const authChefController = require('../controllers/authChefController')
const authOwnerController = require('../controllers/authOwnerController')


router.post('/register', authController.register);

router.post('/login', authController.login)

router.post('/registershopowner', authController.registershopowner)


//ล็อคอินรวมทั้งหมด
router.post('/loginemployee',authController.loginemployee)


// จัดการพนักงาน
router.post('/registeremployee', authEmController.registeremployee)

router.get('/getemployees', authEmController.getEmployee);

router.put('/updateemployee/:id', authEmController.updateemployee);

router.delete('/deleteemployee/:id', authEmController.deleteemployee)


// จัดการแคชเชียร์
router.post('/registercashier', authCasController.registercashier)

router.get('/getcashiers', authCasController.getcashiers);

router.put('/updatecashier/:id', authCasController.updatecashier);

router.delete('/deletecashier/:id', authCasController.deletecashier)



// จัดการเชฟ
router.post('/registerChef', authChefController.registerChef);

router.get('/getChefs', authChefController.getChefs);

router.put('/updateChef/:id', authChefController.updateChef);

router.delete('/deleteChef/:id', authChefController.deleteChef);


//จัดการเจ้าของร้าน
router.post('/addShopowner', authOwnerController.registerShopOwner);

router.get('/getShopowner', authOwnerController.getShopOwners);

router.put('/updateShopowner/:id', authOwnerController.updateShopOwner);

router.delete('/deleteShopowner/:id', authOwnerController.deleteShopOwner);

module.exports = router