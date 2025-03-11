const Product = require('../models/Product');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// เพิ่มสินค้าใหม่
exports.addProduct = async (req, res) => {
    const { product_Name, product_Quantity, product_Stock, product_Price, categoryId, unitId } = req.body;

    try {
        // ตรวจสอบว่าสินค้านี้มีอยู่ในหมวดหมู่เดียวกันหรือไม่
        let product = await Product.findOne({ product_Name, categoryId });
        if (product) {
            return res.status(400).json({ message: 'สินค้านี้มีอยู่แล้วในหมวดหมู่เดียวกัน' });
        }

        // สร้างสินค้าใหม่
        product = new Product({
            product_Name,
            product_Quantity,
            product_Stock,
            product_Price,
            categoryId,
            unitId
        });

        // บันทึกสินค้าในฐานข้อมูล
        await product.save();

        res.status(201).json({
            _id: product._id,
            product_Name: product.product_Name,
            product_Quantity: product.product_Quantity,
            product_Stock: product.product_Stock,
            product_Price: product.product_Price,
            categoryId: product.categoryId,
            unitId: product.unitId,
            message: 'เพิ่มสินค้าใหม่สำเร็จ'
        });
    } catch (error) {
        console.error("Error during Product registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะเพิ่มสินค้า',
            error: error.message || error
        });
    }
};

// ดึงข้อมูลสินค้าทั้งหมด
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate(['categoryId', 'unitId']);  // ดึงข้อมูลหมวดหมู่และหน่วยสินค้า

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// อัปเดตสินค้า
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { product_Name, product_Quantity, product_Stock, product_Price, categoryId, unitId } = req.body;

    try {
        const product = await Product.findByIdAndUpdate(
            id,
            { product_Name, product_Quantity, product_Stock, product_Price, categoryId, unitId },
            { new: true } // คืนค่าใหม่ที่อัปเดต
        );

        if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' });

        res.status(200).json({ message: 'อัปเดตข้อมูลสินค้าสำเร็จ' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสินค้า' });
    }
};

// ลบสินค้า
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'ไม่พบสินค้า' });
        }

        res.status(200).json({ message: 'ลบข้อมูลสินค้าสำเร็จ' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบสินค้า' });
    }
};
