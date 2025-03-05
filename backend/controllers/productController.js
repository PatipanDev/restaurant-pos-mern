const Product = require('../models/Product');  // Use the Product model
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register new product
exports.addproduct = async (req, res) => {
    const { 
        product_Name, 
        product_Quantity, 
        product_Ramquantity, 
        product_Price, 
        category_Id 
    } = req.body;

    try {
        // ตรวจสอบว่ามีสินค้านี้อยู่ในฐานข้อมูลหรือไม่
        let product = await Product.findOne({ product_Name });
        if (product) {
            return res.status(400).json({ message: 'สินค้านี้มีอยู่แล้ว' });
        }

        // สร้างสินค้าใหม่
        product = new Product({
            product_Name,
            product_Quantity,
            product_Ramquantity,
            product_Price,
            category_Id
        });

        // บันทึกสินค้าในฐานข้อมูล
        await product.save();

        res.status(201).json({ 
            _id: product._id,
            product_Name: product.product_Name,
            product_Quantity: product.product_Quantity,
            product_Ramquantity: product.product_Ramquantity,
            product_Price: product.product_Price,
            category_Id: product.category_Id,
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

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category_Id');  // Populate category details

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

// Update product
exports.updateproduct = async (req, res) => {
    const { id } = req.params;
    const { product_Name, product_Quantity, product_Ramquantity, product_Price, category_Id } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' });

        // อัปเดตข้อมูลสินค้า
        product.product_Name = product_Name;
        product.product_Quantity = product_Quantity;
        product.product_Ramquantity = product_Ramquantity;
        product.product_Price = product_Price;
        product.category_Id = category_Id;

        await product.save();

        res.status(200).json({ message: 'อัปเดตข้อมูลสินค้าสำเร็จ' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสินค้า' });
    }
};

// Delete product
exports.deleteproduct = async (req, res) => {
    const { id } = req.params;  // รับ id จาก params

    try {
        // ลบสินค้าโดยใช้ findByIdAndDelete
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
