import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import Order from './../../user/Order';
import socket from '../../../utils/socket';
import { number } from 'yup';

interface OrderFoodDetail {
  _id: string;
  orderDetail_Quantity: number;
  orderDetail_Cooking: string;
  orderDetail_More: string;
  orderDetail_Serving: string;
  food_Id: { food_Name: string };
  chef_Id: { chef_Name: string };
  employee_Id: { employee_Name: string };
  createdAt: string;
}

const OrderTable = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null); // ใช้ในการเก็บการเลือกออเดอร์
  const [ordersfood, setOrderFood] = useState<OrderFoodDetail[]>([]);

  useEffect(() => {
    // เมื่อเชื่อมต่อ socket และขอข้อมูล
    socket.connect();
    // ขอข้อมูลคำสั่งซื้อล่าสุดจากเซิร์ฟเวอร์
    if (socket.connected) {
      socket.emit('get_latest_order');
      console.log("==>Socket connected");
    } else {
      console.error("Socket is not connected!");
    }

    socket.emit('getOrderFoodDetails');

    socket.on('orderFoodDetails', (orderDetails) => {
      console.log('📦 Received order food details:', orderDetails);
      setOrderFood(orderDetails);
    });
  },[])
  const handleStartCooking = (orderId: string) => {
    console.log('เริ่มทำอาหารสำหรับออเดอร์:', orderId);
    // ส่งคำสั่งเริ่มทำอาหารไปที่ server
  };

  const handleConfirmOrder = (orderId: string) => {
    console.log('ยืนยันคำสั่งซื้อสำหรับออเดอร์:', orderId);
    // ส่งคำสั่งยืนยันไปที่ server
  };



  return (
    <>
      <TableContainer component={Paper} sx={{ width: '75vw', height: '90vh' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>รหัสออเดอร์</TableCell>
              <TableCell>ชื่ออาหาร</TableCell>
              <TableCell>เพิ่มเติม</TableCell>
              <TableCell>จำนวน</TableCell>
              <TableCell>สถานะการทำอาหาร</TableCell>
              <TableCell>เชฟที่ทำ</TableCell>
              <TableCell>เวลาออเดอร์</TableCell>
              <TableCell>ปุ่มเริ่มต้น</TableCell>
              <TableCell>ปุ่มยืนยัน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersfood.map((order, index) => (
              <TableRow
                key={order._id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: selectedOrder === order._id ? '#f5f5f5' : '',
                }}
                onClick={() => setSelectedOrder(order._id)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order._id.substring(0, 6)}</TableCell>
                <TableCell>{order.food_Id.food_Name}</TableCell>
                <TableCell>{order.orderDetail_More}</TableCell>
                <TableCell>{order.orderDetail_Quantity}</TableCell>
                <TableCell>{order.orderDetail_Serving}</TableCell>
                <TableCell>{order.chef_Id?.chef_Name || "No Chef Assigned" }</TableCell>
                <TableCell>{}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleStartCooking(order._id)}>
                    เริ่มทำ
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleConfirmOrder(order._id)}>
                    ยืนยัน
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>

  );
};

export default OrderTable;
