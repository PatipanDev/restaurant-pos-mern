const SettingWeb = require('../models/SettingWeb');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra'); // ใช้ fs-extra

exports.postImageIcon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'ไม่พบไฟล์ที่อัปโหลด' });
    }

    const originalPath = req.file.path;
    const originalFilename = req.file.filename;
    const compressedFilename = 'compressed-' + originalFilename;
    const compressedPath = path.join('uploads/image-setting', compressedFilename);

    // บีบอัดและปรับขนาด
    await sharp(originalPath)
      .resize(400, 400)
      .jpeg({ quality: 50 })
      .toFile(compressedPath);

    console.log('บีบอัดไฟล์:', compressedFilename);

    // ลบภาพต้นฉบับ (โดยไม่สน error)
    try {
      await fs.remove(originalPath);
    } catch (_) {}

    // ฟังก์ชันลบไฟล์แบบ force (ไม่ตรวจสอบ ไม่ throw ไม่ log error)
    const forceDeleteFile = async (filename) => {
      if (!filename) return;
      const fullPath = path.join('uploads/image-setting', filename);
      try {
        await fs.remove(fullPath);
      } catch (_) {}
    };

    // ค้นหา Setting เดิม
    const setting = await SettingWeb.findById('singleton-setting');

    if (setting) {
      const oldLogo = setting.logoName;
      const oldOriginal = setting.logoNameOld;

      setting.logoName = compressedFilename;
      setting.logoNameOld = originalFilename;

      // ลบไฟล์เก่าแบบ force
      await Promise.all([
        forceDeleteFile(oldLogo),
        forceDeleteFile(oldOriginal),
      ]);

      await setting.save();
    } else {
      const newSetting = new SettingWeb({
        _id: 'singleton-setting',
        logoName: compressedFilename,
        logoNameOld: originalFilename,
      });
      await newSetting.save();
    }

    res.json({
      message: 'อัปโหลดและบีบอัดสำเร็จ',
      filename: compressedFilename
    });

  } catch (error) {
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการอัปโหลด',
      error: error.message
    });
  }
};


exports.postImageBanner = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'ไม่พบไฟล์ที่อัปโหลด' });
      }
  
      const originalPath = req.file.path;
      const originalFilename = req.file.filename;
      const compressedFilename = 'compressed-' + originalFilename;
      const compressedPath = path.join('uploads/image-setting', compressedFilename);
  
      // บีบอัดและปรับขนาด
      await sharp(originalPath)
        .resize(800, 400)
        .jpeg({ quality: 50 })
        .toFile(compressedPath);
  
      console.log('บีบอัดไฟล์:', compressedFilename);
  
      // ลบภาพต้นฉบับ (โดยไม่สน error)
      try {
        await fs.remove(originalPath);
      } catch (_) {}
  
      // ฟังก์ชันลบไฟล์แบบ force (ไม่ตรวจสอบ ไม่ throw ไม่ log error)
      const forceDeleteFile = async (filename) => {
        if (!filename) return;
        const fullPath = path.join('uploads/image-setting', filename);
        try {
          await fs.remove(fullPath);
        } catch (_) {}
      };
  
      // ค้นหา Setting เดิม
      const setting = await SettingWeb.findById('singleton-setting');
  
      if (setting) {
        const oldLogo = setting.bannerImage;
  
        setting.bannerImage = compressedFilename;
  
        // ลบไฟล์เก่าแบบ force
        await Promise.all([
          forceDeleteFile(oldLogo),
        ]);
  
        await setting.save();
      } else {
        const newSetting = new SettingWeb({
          _id: 'singleton-setting',
          bannerImage: compressedFilename,
        });
        await newSetting.save();
      }
  
      res.json({
        message: 'อัปโหลดและบีบอัดสำเร็จ',
        filename: compressedFilename
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการอัปโหลด',
        error: error.message
      });
    }
  };



  exports.postImageFood = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'ไม่พบไฟล์ที่อัปโหลด' });
      }
  
      const compressedFilenames = [];
  
      for (const file of req.files) {
        const originalPath = file.path;
        const originalFilename = file.filename;
        const compressedFilename = 'compressed-' + originalFilename;
        const compressedPath = path.join('uploads/image-setting', compressedFilename);
  
        await sharp(originalPath)
          .resize(400, 400)
          .jpeg({ quality: 50 })
          .toFile(compressedPath);
  
        // ลบต้นฉบับ
        try {
          await fs.remove(originalPath);
        } catch (_) {}
  
        compressedFilenames.push(compressedFilename);
      }
  
      // ฟังก์ชันลบไฟล์แบบ force
      const forceDeleteFile = async (filename) => {
        if (!filename) return;
        const fullPath = path.join('uploads/image-setting', filename);
        try {
          await fs.remove(fullPath);
        } catch (_) {}
      };
  
      // ค้นหา Setting เดิม
      const setting = await SettingWeb.findById('singleton-setting');
  
      if (setting) {
        const oldImages = setting.recommendedFoods || [];
  
        setting.recommendedFoods = compressedFilenames;
  
        // ลบไฟล์เก่า
        await Promise.all(oldImages.map(forceDeleteFile));
  
        await setting.save();
      } else {
        const newSetting = new SettingWeb({
          _id: 'singleton-setting',
          recommendedFoods: compressedFilenames,
        });
        await newSetting.save();
      }
  
      res.json({
        message: 'อัปโหลดและบีบอัดสำเร็จ',
        filenames: compressedFilenames,
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการอัปโหลด',
        error: error.message
      });
    }
  };


  exports.getFormSetting = async(req, res)=>{
    try{
        const settingweb = await SettingWeb.find();
        if(!settingweb){
            res.status(400).json({
                message: 'ไม่พบข้อมูล'
            })
        }else{
            res.status(200).json({
                message: 'ดึงข้อมูลสำเร็จ',
                settingweb
            })
        }
    }catch(error){
        console.log("Error fetching data settingweb", error)
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
            error: error.message
        })

    }
  }

  
  exports.postFormSetting = async (req, res) => {
    const {
      websiteName,
      websiteDescription,
      phoneNumber,
      eMail,
      facebookAccount,
      lineId,
      xAccount,
      instagramAccount,
      address,
      primaryColor,
      secondaryColor,
      otherContact
    } = req.body;
  
    try {
      // พยายามหา setting เดิม
      const existingSetting = await SettingWeb.findById('singleton-setting');
  
      if (existingSetting) {
        // อัปเดตข้อมูลที่มีอยู่
        existingSetting.websiteName = websiteName;
        existingSetting.websiteDescription = websiteDescription;
        existingSetting.phoneNumber = phoneNumber;
        existingSetting.eMail = eMail;
        existingSetting.facebookAccount = facebookAccount;
        existingSetting.lineId = lineId;
        existingSetting.xAccount = xAccount;
        existingSetting.instagramAccount = instagramAccount;
        existingSetting.address = address;
        existingSetting.primaryColor = primaryColor;
        existingSetting.secondaryColor = secondaryColor;
        existingSetting.otherContact = otherContact;
  
        await existingSetting.save();
  
        return res.status(200).json({ message: 'อัปเดตข้อมูลสำเร็จ', data: existingSetting });
      } else {
        // สร้างใหม่ถ้ายังไม่มี
        const newSetting = new SettingWeb({
          _id: 'singleton-setting', // ให้เป็น singleton เสมอ
          websiteName,
          websiteDescription,
          phoneNumber,
          eMail,
          facebookAccount,
          lineId,
          xAccount,
          instagramAccount,
          address,
          primaryColor,
          secondaryColor,
          otherContact
        });
  
        await newSetting.save();
  
        return res.status(201).json({ message: 'สร้างข้อมูลสำเร็จ', data: newSetting });
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์', error });
    }
  };



  exports.getDataShow = async (req, res)=>{
    try{
      const settingweb = await SettingWeb.findById("singleton-setting");
      res.status(200).json({
        message:'ดึงข้อมูลสำเร็จ',
        settingweb
      })
    }catch(error){
      console.log("Error fetching data settingweb")
      res.status(500).json({
        message: 'ดึงข้อมูลผิดพลาดใน server'
      })
    }
  }
  
