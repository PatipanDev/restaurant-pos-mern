const express = require('express');
const router = express.Router();
const OrderFoodDetail = require('../models/OrderFoodDetail');
// const Food = require('../models/Food');
const mongoose = require('mongoose');

// API ดึงยอดขายรายวัน
exports.getSalesDaily = async (req, res) => {
  try {
    const sales = await OrderFoodDetail.aggregate([
      {
        $lookup: {
          from: "foods", // เชื่อมกับตาราง Foods
          localField: "food_Id",
          foreignField: "_id",
          as: "food"
        }
      },
      { $unwind: "$food" }, // แยก Array ออกมาเป็น Object
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          totalSales: {
            $sum: { $multiply: ["$orderDetail_Quantity", "$food.food_Price"] }
          }
        }
      },
      { $sort: { "_id.date": 1 } } // เรียงตามวันที่
    ]);
    
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
