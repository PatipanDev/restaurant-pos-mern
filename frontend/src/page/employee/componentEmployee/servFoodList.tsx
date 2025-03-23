import React, { Suspense, useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Divider } from '@mui/material';

import socket from '../../../utils/socket';

// ตัวอย่างข้อมูลที่ใช้
const orderData = [
  {
    orderId: '12345',
    foodName: 'Pad Thai',
    details: 'Spicy Thai noodles',
    quantity: 2,
    cookingStatus: 'กำลังทำ',
    servingStatus: 'ยังไม่เสิร์พ',
    server: 'John Doe',
    orderTime: '2025-03-23 14:30',
  },
  {
    orderId: '12346',
    foodName: 'Green Curry',
    details: 'Creamy coconut curry',
    quantity: 1,
    cookingStatus: 'เสร็จแล้ว',
    servingStatus: 'เสิร์พแล้ว',
    server: 'Jane Doe',
    orderTime: '2025-03-23 15:00',
  },
  // เพิ่มข้อมูลออเดอร์อื่น ๆ ตามที่ต้องการ
];

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


  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {orderData.map((order, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  รหัสออเดอร์: {order.orderId}
                </Typography>
                <Typography variant="body1">ชื่ออาหาร: {order.foodName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  รายละเอียด: {order.details}
                </Typography>
                <Typography variant="body2">จำนวน: {order.quantity}</Typography>
                <Typography variant="body2">สถานะการทำอาหาร: {order.cookingStatus}</Typography>
                <Typography variant="body2">สถานะการเสิร์พ: {order.servingStatus}</Typography>
                <Typography variant="body2">พนักงานที่เสิร์พ: {order.server}</Typography>
                <Typography variant="body2">เวลาออเดอร์: {order.orderTime}</Typography>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: '100%' }}
                  disabled={order.servingStatus === 'เสิร์พแล้ว'}
                >
                  ยืนยันการเสิร์พ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServFoodList;
