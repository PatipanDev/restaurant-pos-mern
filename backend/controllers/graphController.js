const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment')

const mongoose = require('mongoose');

// routes/payment.js หรือ controller
exports.getSalesDaily = async (req, res) => {
  try {
    // คำนวณวันที่ 30 วันล่าสุด
    const currentDate = new Date();
    const past30Days = new Date();
    past30Days.setDate(currentDate.getDate() - 30); // ลบ 30 วันจากวันนี้

    // ทำการ aggregate และกรองข้อมูลวันที่
    const result = await Payment.aggregate([
      {
        $match: {
          payment_Date: { $gte: past30Days } // กรองเฉพาะข้อมูลที่มีวันที่หลังจาก 30 วันที่แล้ว
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%m-%d-%Y", date: "$payment_Date" } }
          },
          totalPaid: { $sum: { $toDouble: "$paid_Amount" } } // แปลง Decimal128 → number
        }
      },
      { $sort: { "_id.date": 1 } } // เรียงตามวันที่จากเก่าไปใหม่
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

