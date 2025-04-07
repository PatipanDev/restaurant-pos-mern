const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const settingsWebController = require('../controllers/settingWebController')

// ตั้งค่าการเก็บไฟล์ด้วย multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/image-setting');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
const upload = multer({ storage });

router.post('/postImageIcon', upload.single('icon'), settingsWebController.postImageIcon )

router.post('/postImageBanner', upload.single('banner'), settingsWebController.postImageBanner)
//อัพโหลดภาพแนะนำ
router.post('/postImageFood', upload.array('imagesfood'), settingsWebController.postImageFood)

router.get('/getFormSetting', settingsWebController.getFormSetting)

router.post('/postFormSetting', settingsWebController.postFormSetting)

router.get('/getDataShow', settingsWebController.getDataShow)


module.exports = router; // ส่ง router ออกมา
