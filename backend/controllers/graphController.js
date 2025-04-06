const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment')
const Product = require('../models/Product')
const DeliveryNoteDetails = require('../models/DeliveryNoteDetails')

const mongoose = require('mongoose');
const Food = require('../models/Food');
const Drink = require('../models/Drink');

// routes/payment.js หรือ controller
exports.getSalesDaily = async (req, res) => {
  try {
    // คำนวณวันที่ 30 วันล่าสุด
    const currentDate = new Date();
    const past30Days = new Date();
    past30Days.setDate(currentDate.getDate() - 30); // ลบ 30 วันจากวันนี้

    // ทำการ aggregate และกรองข้อมูลวันที่
    const resultPayment = await Payment.aggregate([
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


    const resultDeliver = await DeliveryNoteDetails.aggregate([
      {
        $lookup: {
          from: 'deliverynotes',
          localField: 'delivery_Note_Id',
          foreignField: '_id',
          as: 'note'
        }
      },
      { $unwind: '$note' },
      {
        $addFields: {
          totalPrice: {
            $multiply: ['$delivery_Quantity', { $toDouble: '$delivery_Price' }]
          },
          date: {
            $let: {
              vars: {
                yearBE: { $add: [{ $year: "$note.shipment_Date" }, 543] },
                month: { $dateToString: { format: "%m", date: "$note.shipment_Date" } },
                day: { $dateToString: { format: "%d", date: "$note.shipment_Date" } }
              },
              in: {
                $concat: ["$$day", "-", "$$month", "-", { $toString: "$$yearBE" }]
              }
            }
          }
        }
      },

      {
        $group: {
          _id: '$date',
          totalAmount: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const products = await Product.find()
      .select('product_Name product_Stock product_Quantity');  // เลือกเฉพาะฟิลด์ที่ต้องการ

    const food = await Food.find()
      .select('food_Name food_Stock');

    const drink = await Drink.find()
      .select('drink_Name drink_Stock_quantity');

    res.status(200).json({
      salesData: resultPayment,   // ข้อมูลยอดขาย
      buyData: resultDeliver,
      productData: products, // ข้อมูลสินค้า
      foodData: food,
      drinkData: drink
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

