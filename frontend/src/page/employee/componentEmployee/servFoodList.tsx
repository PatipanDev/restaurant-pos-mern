import React, { Suspense, useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import { getEmployeeId } from '../../../utils/userUtils';
import { formatDateTime } from '../../../utils/formatDateTime';


const userId = getEmployeeId();

import socket from '../../../utils/socket';

const translateStatusServ = (status: string) => {
  switch (status) {
    case 'Not Served':
      return (
        <span style={{ color: 'orange' }}>
          <span role="img" aria-label="not-served">⏳</span> ยังไม่ได้เสิร์ฟ
        </span>
      );
    case 'Served':
      return (
        <span style={{ color: 'blue' }}>
          <span role="img" aria-label="served">🍽️</span> เสิร์ฟแล้ว
        </span>
      );
    case 'Delivered':
      return (
        <span style={{ color: 'green' }}>
          <span role="img" aria-label="delivered">📦</span> ส่งถึงแล้ว
        </span>
      );
    case 'Returned':
      return (
        <span style={{ color: 'red' }}>
          <span role="img" aria-label="returned">🔄</span> ถูกส่งคืน
        </span>
      );
    default:
      return status; // ถ้าสถานะไม่ตรงกับที่กำหนด, ให้แสดงสถานะเดิม
  }
};


const ServFoodList: React.FC = () => {
  const [foodready, setFoodReady] = useState<any[]>([]);

  useEffect(() => {
    // เปิดการเชื่อมต่อ socket
    socket.connect();
    // ขอข้อมูลคำสั่งซื้อล่าสุดจากเซิร์ฟเวอร์
    if (socket.connected) {
      socket.emit('getFoodReady');
      console.log("==>Socket connected");
    } else {
      console.error("Socket is not connected!");
    }

    socket.on('dataFoodReady', (Serving) => {
      console.log('📦 คำสั่งซื้อที่ได้รับ:', Serving);
      if (Serving) {
        setFoodReady(Serving);
      } else {
        console.error("ไม่มีคำสั่งซื้อใหม่");
      }
    });

  }, []);



  const handleConfirmServ = (orderId: string) => {
    const isConfirmed = window.confirm("คุณต้องการยืนยันว่าทำอาหารเสร็จใช่หรือไม่?");
    if (!isConfirmed) {
      console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
      return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
    }

    const userId = getEmployeeId();
    console.log("ชื่อ", userId, "oder", orderId)
    // ส่งข้อมูลไปที่ Server เพื่อยืนยันคำสั่งซื้อ
    socket.emit('FinishServ', { orderId, userId });

    // ฟังผลลัพธ์จาก Server
    socket.once('ServConfirmed', (servking) => {
      console.log('Servking Finish fconfirmed successfully 👌👌:', servking);
      alert('ยืนยันคำสั่งซื้อสำเร็จ!');

    // อัปเดต State โดยไม่ต้องโหลดใหม่
    setFoodReady((prevOrders) => prevOrders.filter(order => order._id !== orderId));
  });

  socket.on('orderError', (error) => {
    console.error('Error confirming order:', error.message);
    alert(`เกิดข้อผิดพลาด: ${error.message}`);
  });
  };


  if (foodready.length === 0) {
    return (
      <div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh" // ทำให้ Box เต็มความสูงของ viewport
        >
          <Typography variant="body1" align="center">
            ไม่มีรายการ
          </Typography>
        </Box>
      </div>
    )
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {foodready.map((order, index) => {
                        const { formattedDate, formattedTime } = formatDateTime(order.createdAt);
        return(
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  โต๊ะ หมายเลข: {order.order_Id?.table_Id?.number}
                </Typography>
                <Typography variant="body1">ชื่ออาหาร: {order.food_Id?.food_Name}</Typography>
                <Typography variant="body2">
                  รหัสออเดอร์: {order?._id.substring(0, 6)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  รายละเอียด: {order?.orderDetail_More || "ไม่มีรายละเอียด"}
                </Typography>
                <Typography variant="body2">จำนวน: x{order?.orderDetail_Quantity} </Typography>
                <Typography variant="body2">สถานะการเสิร์พ:  {translateStatusServ(order?.orderDetail_Serving)}</Typography>
                <Typography variant="body2">พนักงานที่เสิร์พ: {order?.employee_Id || "ยังไม่ได้เสิร์พ"}</Typography>
                <Typography variant="body2">เวลาทำอาหารเสร็จ: {formattedTime}</Typography>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleConfirmServ(order._id)}
                  // disabled={order.orderDetail_Cooking !== "In Progress" || String(order.chef_Id) === String(userId)}
                >
                  ยืนยันการเสิร์พ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )})}
      </Grid>
    </Box>
  );
};

export default ServFoodList;
