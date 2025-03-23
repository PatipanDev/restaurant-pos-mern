const Order = require('../models/Order');
const Table = require('../models/Table');
const OrderFoodDetail = require('../models/OrderFoodDetail')
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

    // เมื่อได้รับคำขอข้อมูลคำสั่งซื้อล่าสุด
    socket.on('get_latest_order', async () => {
      try {
        // ดึงข้อมูลคำสั่งซื้อที่สถานะเป็น 'In Progress' และไม่มี employee_Id
        const latestOrders = await Order.find({
          order_Status: 'In Progress',
          employee_Id: { $exists: false }  // ตรวจสอบว่าไม่มี employee_Id
        })
          .populate('customer_Id', 'customer_Name customer_Telnum') // ดึงเฉพาะชื่อและเบอร์โทรของลูกค้า
          .populate('table_Id', 'number seat_count'); // ดึงหมายเลขโต๊ะและจำนวนที่นั่ง

        // ส่งข้อมูลไปยัง client
        socket.emit('new_order_for_staff', latestOrders);
      } catch (error) {
        console.error('Error fetching latest orders:', error);
      }
    });


    //ดึงข้อมูลอาหารที่เชฟต้องทำ
    socket.on('getOrderFoodDetails', async () => {
      try {
        // ค้นหา Order ที่มี order_Status = "In Progress" และมี employee_Id
        const orders = await Order.find(
          { order_Status: "In Progress", employee_Id: { $exists: true, $ne: null } },
          { _id: 1 }
        );
        
        // ดึงเฉพาะ _id ของ Order
        const orderIds = orders.map(order => order._id);
    
        if (orderIds.length === 0) {
          // ถ้าไม่มีคำสั่งซื้อที่ตรงตามเงื่อนไข ส่งข้อความแจ้งเตือนกลับไป
          socket.emit('orderFoodDetails', { message: 'No orders found with the given criteria.' });
          return;
        }
    
        // ค้นหาข้อมูลใน OrderFoodDetail โดยใช้ order_Id ที่ได้จาก orderIds
        const orderDetails = await OrderFoodDetail.find({
          order_Id: { $in: orderIds },
          orderDetail_Cooking: { $in: ["In Progress", "Pending"] } // ใช้ $in เพื่อเลือกค่าใดค่าหนึ่ง
        })
          .populate('order_Id')  // ดึงข้อมูลจาก Order model
          .populate('food_Id')   // ดึงข้อมูลจาก Food model
          .populate('chef_Id');  // ดึงข้อมูลจาก Chef model
    
        if (orderDetails.length === 0) {
          // ถ้าไม่มีข้อมูลใน OrderFoodDetail ส่งข้อความแจ้งเตือน
          socket.emit('orderFoodDetails', []); // ✅ ส่ง array แทน object
        } else {
          // ส่งข้อมูลกลับไปยังไคลเอนต์
          socket.emit('orderFoodDetails', orderDetails);
        }
      } catch (error) {
        console.error('Error fetching order food details:', error);
        socket.emit('orderFoodDetailsError', 'Error fetching order food details');
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
        const latestOrders = await Order.find({
          order_Status: 'In Progress',
          employee_Id: { $exists: false }  // ตรวจสอบว่าไม่มี employee_Id
        })
          .populate('customer_Id', 'customer_Name customer_Telnum') // ดึงเฉพาะชื่อและเบอร์โทรของลูกค้า
          .populate('table_Id', 'number seat_count'); // ดึงหมายเลขโต๊ะและจำนวนที่นั่ง

        // ส่งข้อมูลไปยัง client
        io.emit('new_order_for_staff', latestOrders);
        socket.emit('new_order_for_staff', latestOrders);
        io.emit("update_table_status", { table_Id, table_Status: table.table_Status });

        // ส่งข้อมูลกลับไปยัง client
        socket.emit('success', { message: "Order and table status updated successfully", order: updatedOrder });

      } catch (error) {
        console.error("Server Error:", error.message);
        socket.emit('error', { message: "Server error", error: error.message });
      }
    });

    // ฟัง event 'confirmOrder' และทำการอัปเดตข้อมูลในฐานข้อมูล

    socket.on('confirmOrder', async ({ orderId, userId }) => {
      try {
        // อัปเดตคำสั่งซื้อในฐานข้อมูล
        const order = await Order.findByIdAndUpdate(orderId, {
          employee_Id: userId
        }, { new: true });

        // ส่งข้อมูลกลับไปที่ client ว่าอัปเดตสำเร็จ
        socket.emit('orderConfirmed', order);

      } catch (error) {
        console.error('Error updating order:', error);
        // ส่งข้อผิดพลาดกลับไปยัง client
        socket.emit('orderError', { message: 'Error updating order' });
      }
    });

    // ยกเลิกออเดอร์ที่ลูกค้าส่งมา
    socket.on('CancelledOrder', async ({ orderId, userId }) => {
      try {
        // อัปเดตคำสั่งซื้อในฐานข้อมูล
        const order = await Order.findByIdAndUpdate(orderId, {
          employee_Id: userId,
          order_Status: "Cancelled"
        }, { new: true });

        // ส่งข้อมูลกลับไปที่ client ว่าอัปเดตสำเร็จ
        socket.emit('orderCancelled', order);

      } catch (error) {
        console.error('Error updating order:', error);
        // ส่งข้อผิดพลาดกลับไปยัง client
        socket.emit('orderError', { message: 'Error updating order' });
      }
    });


    //สำหรับเชฟเริ่มการทำอาหาร
    socket.on('startCooking', async ({ orderId, userId }) => {
      try {
        // อัปเดตคำสั่งซื้อในฐานข้อมูล
        const cooking = await OrderFoodDetail.findByIdAndUpdate(orderId, {
          chef_Id: userId,
          orderDetail_Cooking: "In Progress"
        }, { new: true });

        // ส่งข้อมูลกลับไปที่ client ว่าอัปเดตสำเร็จ
        socket.emit('startConfirmed', cooking);

        ///เอามาจากการเฟรชครั้งแรกของเชฟ
        const orders = await Order.find(
          { order_Status: "In Progress", employee_Id: { $exists: true, $ne: null } },
          { _id: 1 }
        );
        
        // ดึงเฉพาะ _id ของ Order
        const orderIds = orders.map(order => order._id);
    
        if (orderIds.length === 0) {
          // ถ้าไม่มีคำสั่งซื้อที่ตรงตามเงื่อนไข ส่งข้อความแจ้งเตือนกลับไป
          socket.emit('orderFoodDetails', { message: 'No orders found with the given criteria.' });
          return;
        }
    
        // ค้นหาข้อมูลใน OrderFoodDetail โดยใช้ order_Id ที่ได้จาก orderIds
        const orderDetails = await OrderFoodDetail.find({ order_Id: { $in: orderIds }})
          .populate('order_Id')  // ดึงข้อมูลจาก Order model
          .populate('food_Id')   // ดึงข้อมูลจาก Food model
          .populate('chef_Id');  // ดึงข้อมูลจาก Chef model
    
        if (orderDetails.length === 0) {
          // ถ้าไม่มีข้อมูลใน OrderFoodDetail ส่งข้อความแจ้งเตือน
          socket.emit('orderFoodDetails', []); // ✅ ส่ง array แทน object
        } else {
          // ส่งข้อมูลกลับไปยังไคลเอนต์
          io.emit('orderFoodDetails', orderDetails);
        }

      } catch (error) {
        console.error('Error updating order:', error);
        // ส่งข้อผิดพลาดกลับไปยัง client
        socket.emit('orderError', { message: 'Error updating order' });
      }
    });

    //สำหรับเชฟเริ่มการทำอาหาร
    socket.on('FinishCooking', async ({ orderId, userId }) => {
      try {
        // อัปเดตคำสั่งซื้อในฐานข้อมูล
        const cooking = await OrderFoodDetail.findByIdAndUpdate(orderId, {
          chef_Id: userId,
          orderDetail_Cooking: "Completed"
        }, { new: true });

        // ส่งข้อมูลกลับไปที่ client ว่าอัปเดตสำเร็จ
        socket.emit('FinishConfirmed', cooking);

      } catch (error) {
        console.error('Error updating order:', error);
        // ส่งข้อผิดพลาดกลับไปยัง client
        socket.emit('orderError', { message: 'Error updating order' });
      }
    });

  });


  //พนักงาน รับอาหารที่ทำเสร็จจากเชฟ
  



  return router;
};
