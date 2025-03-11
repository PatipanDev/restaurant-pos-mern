const Table = require('../models/Table'); // เปลี่ยนเป็น Table model
const express = require('express');
const router = express.Router();

exports.registerTable = async (req, res) => {
    const { 
        number, 
        status, 
        seat_count 
    } = req.body;

    try {
        // ตรวจสอบว่าโต๊ะหมายเลขนี้มีอยู่แล้วหรือไม่
        let table = await Table.findOne({ number });
        if (table) {
            return res.status(400).json({ message: 'หมายเลขโต๊ะนี้ถูกใช้ไปแล้ว' });
        }

        // สร้าง Table ใหม่
        table = new Table({
            number,
            status,
            seat_count
        });

        // บันทึกข้อมูล Table ลงฐานข้อมูล
        await table.save();

        res.status(201).json({ 
            _id: table._id,
            number: table.number,
            status: table.status,
            seat_count: table.seat_count,
            message: 'สมัครโต๊ะใหม่สำเร็จ' 
        });
    } catch (error) {
        console.error("Error during Table registration:", error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดขณะสมัครโต๊ะใหม่',
            error: error.message || error
        });
    }
};

exports.getTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ', error: error.message });
    }
};

exports.updateTable = async (req, res) => {
    const { id } = req.params;
    const { number, status, seat_count } = req.body;

    try {
        const table = await Table.findById(id);
        if (!table) return res.status(404).json({ message: 'ไม่พบโต๊ะที่ต้องการอัปเดต' });

        // อัปเดตข้อมูลโต๊ะ
        table.number = number;
        table.status = status;
        table.seat_count = seat_count;

        await table.save();

        res.status(200).json({ message: 'อัปเดตข้อมูลโต๊ะสำเร็จ' });
    } catch (error) {
        console.error('Error updating table:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลโต๊ะ' });
    }
};

exports.deleteTable = async (req, res) => {
    const { id } = req.params;

    try {
        const table = await Table.findByIdAndDelete(id);
        
        if (!table) {
            return res.status(404).json({ message: 'ไม่พบโต๊ะที่ต้องการลบ' });
        }

        res.status(200).json({ message: 'ลบข้อมูลโต๊ะสำเร็จ' });
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลโต๊ะ' });
    }
};
