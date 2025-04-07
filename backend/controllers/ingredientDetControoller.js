const IngredientDetail = require('../models/IngredientDetail'); // แก้ไข path ตามจริง
// const Ingredient = require('../models/Ingredient'); // หากต้องการดึงข้อมูล Ingredient
const Product = require('../models/Product'); // หากต้องการดึงข้อมูล Product
const express = require('express');
const router = express.Router();


// เพิ่ม IngredientDetail ใหม่
const mongoose = require("mongoose");
// const IngredientDetail = require("../models/IngredientDetail");
// const Product = require("../models/Product");

// เพิ่ม IngredientDetail และอัปเดต Product ด้วย Transaction
exports.addIngredientDetail = async (req, res) => {
  const { IngredientDt_Qua, ingredient_Id, product_Id } = req.body;

  try {
    // ค้นหา Product ที่ต้องอัปเดต
    const product = await Product.findById(product_Id);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้าในระบบ" });
    }

    // ตรวจสอบว่า IngredientDt_Qua มากกว่าจำนวน stock หรือไม่
    if (IngredientDt_Qua > product.product_Stock) {
      return res.status(400).json({
        message: `ไม่สามารถเพิ่ม Ingredient ได้ เนื่องจากมี Stock เพียง ${product.product_Stock}`,
      });
    }

    // เพิ่มข้อมูล IngredientDetail ใหม่
    const ingredientDetail = new IngredientDetail({
      IngredientDt_Qua,
      ingredient_Id,
      product_Id,
    });
    await ingredientDetail.save();

    // คำนวณค่าใหม่
    product.product_Quantity += IngredientDt_Qua;
    product.product_Stock -= IngredientDt_Qua;

    // บันทึกค่าใหม่กลับไปในฐานข้อมูล
    await product.save();

    res.status(200).json({
      _id: ingredientDetail._id,
      IngredientDt_Qua: ingredientDetail.IngredientDt_Qua,
      ingredient_Id: ingredientDetail.ingredient_Id,
      product_Id: ingredientDetail.product_Id,
      updatedProduct: {
        product_Quantity: product.product_Quantity,
        product_Stock: product.product_Stock,
      },
      message: "เพิ่ม IngredientDetail ใหม่สำเร็จ และอัปเดตข้อมูลสินค้าแล้ว",
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดขณะเพิ่มข้อมูล",
      error: error.message || error,
    });
  }
};




// ดึงข้อมูล IngredientDetail ทั้งหมด
exports.getIngredientDetailsByIngredientId = async (req, res) => {
  try {
      const { id } = req.params; // รับค่า ingredient_id จาก URL parameter
      console.log(id);

      // ค้นหา ingredient detail ด้วย ID เดียว
      const ingredientDetails = await IngredientDetail.find({ingredient_Id:id})
          .populate('ingredient_Id')
          .populate({
              path: 'product_Id',
              populate: { path: 'unitId', select: 'unit_Name' } // ดึง unit_Name จาก unitId
          });

      // ตรวจสอบว่าเจอข้อมูลหรือไม่
      if (!ingredientDetails) {
          return res.status(404).json({ message: 'ไม่พบข้อมูล' });
      }

      res.status(200).json(ingredientDetails); // ส่งข้อมูลกลับ
  } catch (error) {
      console.error('Error fetching ingredient details:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};
  

// อัปเดต IngredientDetail
exports.updateIngredientDetail = async (req, res) => {
  const { id } = req.params;
  const { IngredientDt_Qua, ingredient_Id, item_Id, product_Id } = req.body;

  try {
    // ค้นหาข้อมูล IngredientDetail ที่จะอัปเดต
    const ingredientDetail = await IngredientDetail.findById(id);
    if (!ingredientDetail) return res.status(404).json({ message: 'ไม่พบ IngredientDetail' });

    // คำนวณการเปลี่ยนแปลงใน Product ที่เกี่ยวข้อง
    const previousQuantity = ingredientDetail.IngredientDt_Qua;
    const quantityDifference = IngredientDt_Qua - previousQuantity;

    // ค้นหาข้อมูล Product ที่เกี่ยวข้อง
    const product = await Product.findById(product_Id);
    if (!product) return res.status(404).json({ message: 'ไม่พบสินค้าในระบบ' });

    // อัปเดต IngredientDetail
    ingredientDetail.IngredientDt_Qua = IngredientDt_Qua;
    ingredientDetail.ingredient_Id = ingredient_Id;
    ingredientDetail.item_id = item_Id;

    // คำนวณค่าใหม่ของ Product
    product.product_Quantity += quantityDifference;
    product.product_Stock -= quantityDifference;

    // เช็คว่า Stock ไม่ติดลบ
    if (product.product_Stock < 0) {
      return res.status(400).json({
        message: "ไม่สามารถอัปเดตสินค้าได้: คลังสินค้าหมด",
      });
    }

    // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
    await ingredientDetail.save();
    await product.save();

    res.status(200).json({
      message: 'อัปเดตข้อมูล IngredientDetail และ Product สำเร็จ',
      updatedIngredientDetail: ingredientDetail,
      updatedProduct: {
        product_Quantity: product.product_Quantity,
        product_Stock: product.product_Stock,
      },
    });

  } catch (error) {
    console.error('Error updating ingredient detail:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต IngredientDetail และ Product' });
  }
};


exports.deleteIngredientDetail = async (req, res) => {
  const { id } = req.params;

  try {
    // ค้นหา IngredientDetail ที่ต้องการลบ
    const ingredientDetail = await IngredientDetail.findById(id);
    if (!ingredientDetail) {
      return res.status(404).json({ message: "ไม่พบ IngredientDetail" });
    }

    // ค้นหา Product ที่เกี่ยวข้อง (ถ้ายังมีอยู่)
    const product = await Product.findById(ingredientDetail.product_Id);

    if (product) {
      // ตรวจสอบว่าค่าที่ลบออกจะไม่ทำให้ product_Quantity ติดลบ
      if (product.product_Quantity < ingredientDetail.IngredientDt_Qua) {
        console.warn(
          `⚠️ product_Quantity มีไม่พอ (มี ${product.product_Quantity} แต่ต้องลบ ${ingredientDetail.IngredientDt_Qua})`
        );

        // ลบ IngredientDetail โดยไม่อัปเดต Product
        await ingredientDetail.deleteOne();
        return res.status(200).json({
          message: "ลบข้อมูล IngredientDetail สำเร็จ (แต่ไม่สามารถอัปเดต Product ได้เพราะจำนวนไม่พอ)",
          updatedProduct: null,
        });
      }

      // คำนวณค่าใหม่หลังจากลบ
      product.product_Quantity -= ingredientDetail.IngredientDt_Qua;
      product.product_Stock += ingredientDetail.IngredientDt_Qua;

      // บันทึกค่าที่อัปเดตของ Product
      await product.save();
    }

    // ลบ IngredientDetail
    await ingredientDetail.deleteOne();

    res.status(200).json({
      message: product
        ? "ลบข้อมูล IngredientDetail สำเร็จ และอัปเดต Product แล้ว"
        : "ลบข้อมูล IngredientDetail สำเร็จ (แต่ไม่พบ Product ที่เกี่ยวข้อง)",
      updatedProduct: product
        ? {
            product_Quantity: product.product_Quantity,
            product_Stock: product.product_Stock,
          }
        : null,
    });

  } catch (error) {
    console.error("❌ Error deleting ingredient detail:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบ IngredientDetail" });
  }
};






// อัปเดต IngredientDetail
// exports.updateNewProduct = async (req, res) => {
//   const { id } = req.params;
//   const { product_Quantity, product_Stock} = req.body;

//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { product_Quantity, product_Stock},
//       { new: true }
//     );

//     if (!updatedProduct) return res.status(404).json({ message: 'ไม่พบ Product' });

//     res.status(200).json({ message: 'อัปเดตข้อมูล Product สำเร็จ' });
//   } catch (error) {
//     console.error('Error updating ingredient detail:', error);
//     res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต product' });
//   }
// };

// module.exports = router;