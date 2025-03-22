const Order = require('../models/Order');
const Table = require('../models/Table');
const express = require('express');
const router = express.Router();  // เพิ่มการประกาศ router ที่นี่

module.exports = function (io) {
  // เมื่อมีการเชื่อมต่อกับ server
  io.on('connection', (socket) => {
    console.log('A user connected');

    // ฟังก์ชันการส่งข้อมูลไปยัง client
    socket.emit('welcome', 'Welcome to the server!');

    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    // ฟังคำสั่งจาก client เพื่อเข้าร่วมห้อง
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName); // เข้าร่วม room
      console.log(`Client joined room: ${roomName}`);
    });

    // เมื่อได้รับคำขอข้อมูลคำสั่งซื้อล่าสุด
    socket.on('get_latest_order', async () => {
      try {
        // ดึงข้อมูลคำสั่งซื้อที่อัปเดตล่าสุดและรวมข้อมูลที่เกี่ยวข้อง
        const latestOrder = await Order.find({ order_Status: 'In Progress' })
          .populate('employee_Id', 'name position') // ดึงเฉพาะ name และ position ของพนักงาน
          .populate('customer_Id', 'customer_Name customer_Telnum') // ดึงเฉพาะชื่อและเบอร์โทรของลูกค้า
          .populate('table_Id', 'number seat_count'); // ดึงหมายเลขโต๊ะและจำนวนที่นั่ง

        // ส่งข้อมูลไปยัง client
        socket.emit('new_order_for_staff', latestOrder);
      } catch (error) {
        console.error('Error fetching latest orders:', error);
      }
    });

    // เมื่อได้รับคำขออัปเดตคำสั่งซื้อและสถานะโต๊ะ
    socket.on('putSendOrderDetail', async (orderData) => {
      try {
        const { id, table_Id, order_Eating_status } = orderData;

        console.log("Received Data:", orderData); // ✅ Debugging

        if (!table_Id) {
          return socket.emit('error', { message: "Table ID is required" });
        }
        if (!order_Eating_status) {
          return socket.emit('error', { message: "Order eating status is required" });
        }

        const order = await Order.findById(id);
        if (!order) {
          return socket.emit('error', { message: "Order not found" });
        }

        const table = await Table.findById(table_Id);
        if (!table) {
          return socket.emit('error', { message: "Table not found" });
        }

        // ✅ อัปเดต Order
        order.table_Id = table_Id;
        order.order_Eating_status = order_Eating_status;
        order.order_Status = "In Progress";

        // ✅ อัปเดตสถานะของโต๊ะ
        table.status = "Occupied";
        await table.save();

        const updatedOrder = await order.save();

        // ✅ แจ้งเตือนผ่าน Socket.io
        // ดึงข้อมูลคำสั่งซื้อที่อัปเดตล่าสุดและรวมข้อมูลที่เกี่ยวข้อง
        const latestOrder = await Order.find({ order_Status: 'In Progress' })
          .populate('employee_Id', 'name position') // ดึงเฉพาะ name และ position ของพนักงาน
          .populate('customer_Id', 'customer_Name customer_Telnum') // ดึงเฉพาะชื่อและเบอร์โทรของลูกค้า
          .populate('table_Id', 'number seat_count'); // ดึงหมายเลขโต๊ะและจำนวนที่นั่ง

        // ส่งข้อมูลไปยัง client
        io.to('order').emit('new_order_for_staff', latestOrder);
        io.emit("update_table_status", { table_Id, table_Status: table.table_Status });

        // ส่งข้อมูลกลับไปยัง client
        socket.emit('success', { message: "Order and table status updated successfully", order: updatedOrder });

      } catch (error) {
        console.error("Server Error:", error.message);
        socket.emit('error', { message: "Server error", error: error.message });
      }
    });

  });
  return router;
};
