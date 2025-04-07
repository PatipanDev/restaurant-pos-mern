const Payment = require('../models/Payment')
const Order = require('../models/Order')
const OrderFoodDetail = require('../models/OrderFoodDetail')
const OrderDrinkDetail = require('../models/OrderDrinkDetail')
const Table = require('../models/Table')
const mongoose = require('mongoose');
const Receipt = require('../models/Receipt')



exports.getPaymentsByOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        // ค้นหาข้อมูลออเดอร์ที่สถานะเป็น "Pending" โดยอิงจาก customer_Id
        const payment = await Payment.find({
            order_Id: orderId,
            payment_Status: 'Pending'
        }).populate('order_Id customer_Id cashier_Id');

        // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
        if (payment.length === 0) {
            return res.status(404).json({ message: 'ไม่มีข้อมูลการชำระเงิน' });
        }
        // ส่งข้อมูลคำสั่งซื้อพร้อมรายละเอียดอาหาร น้ำดื่ม และข้อมูลโต๊ะที่พบ
        return res.status(200).json({
            payment
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};

exports.getpaymentorderByCashier = async (req, res) => {
    try {
        // ค้นหาข้อมูลออเดอร์ที่สถานะเป็น "Pending" โดยอิงจาก customer_Id
        const orders = await Order.find({ order_Status: 'In Progress' })
            .populate("table_Id", "number seat_count")
            .populate("employee_Id")
            .populate("customer_Id")

        // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No pending orders found for this customer.' });
        }

        // ดึงข้อมูล Table ที่เชื่อมโยงกับแต่ละคำสั่งซื้อ
        const tables = await Table.find({});

        // ดึงข้อมูล OrderFoodDetail และ OrderDrinkDetail พร้อมกันด้วย Promise.all
        const [orderFoodDetails, orderDrinkDetails, payment] = await Promise.all([
            OrderFoodDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('food_Id')  // Populate the food details (menu items)
                .populate('chef_Id')  // Optionally, populate other details like chef
                .populate('employee_Id'),  // Optionally, populate employee details
            OrderDrinkDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('drink_Id')  // Populate the drink details (drink items)
                .populate('employee_Id'),  // Optionally, populate employee details
            Payment.find({ order_Id: { $in: orders.map(order => order._id) } })
        ]);

        // ส่งข้อมูลคำสั่งซื้อพร้อมรายละเอียดอาหาร น้ำดื่ม และข้อมูลโต๊ะที่พบ
        return res.status(200).json({
            orders,
            orderFoodDetails,
            orderDrinkDetails,
            tables, // เพิ่มข้อมูลโต๊ะ
            payment
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};

exports.getpaymentorderByCashierFinish = async (req, res) => {
    try {
        // ค้นหาข้อมูลออเดอร์ที่สถานะเป็น "Pending" โดยอิงจาก customer_Id
        const orders = await Order.find({
            order_Status: { $in: ['Completed', 'Cancelled'] }
          })
            .populate("table_Id", "number seat_count")
            .populate("employee_Id")
            .populate("customer_Id")

        // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No pending orders found for this customer.' });
        }

        // ดึงข้อมูล Table ที่เชื่อมโยงกับแต่ละคำสั่งซื้อ
        const tables = await Table.find({});

        // ดึงข้อมูล OrderFoodDetail และ OrderDrinkDetail พร้อมกันด้วย Promise.all
        const [orderFoodDetails, orderDrinkDetails, payment] = await Promise.all([
            OrderFoodDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('food_Id')  // Populate the food details (menu items)
                .populate('chef_Id')  // Optionally, populate other details like chef
                .populate('employee_Id'),  // Optionally, populate employee details
            OrderDrinkDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('drink_Id')  // Populate the drink details (drink items)
                .populate('employee_Id'),  // Optionally, populate employee details
            Payment.find({ order_Id: { $in: orders.map(order => order._id) } })
        ]);

        // ส่งข้อมูลคำสั่งซื้อพร้อมรายละเอียดอาหาร น้ำดื่ม และข้อมูลโต๊ะที่พบ
        return res.status(200).json({
            orders,
            orderFoodDetails,
            orderDrinkDetails,
            tables, // เพิ่มข้อมูลโต๊ะ
            payment
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};

exports.updateQuantityFood = async (req, res) => {
    const { _id } = req.params;
    console.log('_id:', _id); // เพิ่มการดีบัก
    const { orderDetail_Quantity } = req.body;

    try {
        if (orderDetail_Quantity <= 0) {
            // ถ้าจำนวนน้อยกว่าหรือเท่ากับศูนย์ ลบรายการ
            const deletedOrderDetail = await OrderFoodDetail.findOneAndDelete({ _id });

            if (!deletedOrderDetail) {
                return res.status(404).json({ message: 'Order detail not found to delete' });
            }

            // ส่งข้อความว่าได้ลบรายการแล้ว
            return res.status(200).json({ message: 'Order detail deleted successfully' });
        }

        // หากจำนวนสินค้าถูกอัพเดตให้เกิน 0
        const updatedOrderDetail = await OrderFoodDetail.findOneAndUpdate(
            { _id: _id },
            { $set: { orderDetail_Quantity } },
            { new: true } // คืนค่าเอกสารที่ถูกอัพเดต
        );

        // ตรวจสอบว่าอัพเดตสำเร็จ
        if (!updatedOrderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }

        // ส่งค่าผลลัพธ์ที่อัพเดตกลับไปยังผู้ใช้
        res.status(200).json(updatedOrderDetail);
    } catch (error) {
        console.error('Error updating order detail:', error);
        res.status(500).json({ message: 'An error occurred while updating the order detail.', error: error.message });
    }
};


exports.updateQuantityDrink = async (req, res) => {
    const { _id } = req.params;
    console.log('_id:', _id); // เพิ่มการดีบัก
    const { orderDetail_Quantity } = req.body;

    try {
        if (orderDetail_Quantity <= 0) {
            // ถ้าจำนวนน้อยกว่าหรือเท่ากับศูนย์ ลบรายการ
            const deletedOrderDetail = await OrderDrinkDetail.findOneAndDelete({ _id });

            if (!deletedOrderDetail) {
                return res.status(404).json({ message: 'Order detail not found to delete' });
            }

            // ส่งข้อความว่าได้ลบรายการแล้ว
            return res.status(200).json({ message: 'Order detail deleted successfully' });
        }

        // หากจำนวนสินค้าถูกอัพเดตให้เกิน 0
        const updatedOrderDetail = await OrderDrinkDetail.findOneAndUpdate(
            { _id: _id },
            { $set: { orderDetail_Quantity } },
            { new: true } // คืนค่าเอกสารที่ถูกอัพเดต
        );

        // ตรวจสอบว่าอัพเดตสำเร็จ
        if (!updatedOrderDetail) {
            return res.status(404).json({ message: 'Order detail not found' });
        }

        // ส่งค่าผลลัพธ์ที่อัพเดตกลับไปยังผู้ใช้
        res.status(200).json(updatedOrderDetail);
    } catch (error) {
        console.error('Error updating order detail:', error);
        res.status(500).json({ message: 'An error occurred while updating the order detail.', error: error.message });
    }
};

//อัพเดตโดย พนักงานแคชเชียร๋์
exports.updatePaymentCutomer = async (req, res) => {
    const { id } = req.params;
    const { payment_Method, change_Amount, received_Amount, paid_Amount, cashier_Id } = req.body.newData;
    console.log(req.body.newData);
    console.log("ไอดี",req.params)

    try {
        const payment = await Payment.findOne({ order_Id: id });
        console.log('payment:', payment);

        if (!payment) {
            return res.status(404).json({
                message: 'ไม่พบข้อมูลในฐานข้อมูล',
            });
        }
        const currentTime = new Date().toLocaleTimeString(); // เวลาปัจจุบัน
        const currentDate = new Date().toLocaleDateString(); // วันที่ปัจจุบัน

        // อัพเดตค่า
        payment.payment_Method = payment_Method;
        payment.change_Amount = change_Amount;
        payment.received_Amount = received_Amount;
        payment.paid_Amount = paid_Amount;
        payment.payment_Status = "Paid"
        payment.payment_Time = currentTime;
        payment.payment_Date = currentDate;
        payment.cashier_Id = cashier_Id;

        await payment.save();
        //ทำการอัพเดตสถานะออเดอร์
        if (payment) {
            const order = await Order.findById(id);
            order.order_Status = "Completed"
            await order.save();
            if (order) {
                const tableId = order.table_Id
                const table = await Table.findByIdAndUpdate(tableId, { status: 'Available' }, { new: true });

                if(table){
                    let receipt = new Receipt({
                        payment_Id: payment._id,
                        cashier_Id: cashier_Id,
                        order_Id: order._id
                    });
    
                    await receipt.save(); // บันทึกข้อมูล
                    if (receipt) {
                        return res.status(200).json({
                            message: 'ยืนยันการชำระเงินสำเร็จ',
                            data: payment,
                            order: order,
                            receipt_Id: receipt._id
                        });
                    }   // จัดรูปแบบ Receipt_ID ให้เป็น 7 หลัก
                }
                //ทำการเพิ่มบิล
            }

        }
    } catch (error) {
        console.log("Error update data in server", error);
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการอัพเดตข้อมูล',
            error: error.message || error,
        });
    }
};

