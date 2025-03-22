import React, { Suspense, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Divider, Grid } from '@mui/material';
import OrderDetailsCheck from './OrderDetailsCheck';

import socket from '../../../utils/socket';
// ฟังเหตุการณ์ที่ส่งจาก server
import { formatDateTime } from '../../../utils/formatDateTime';


const OrderDetailsCard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // เปิดการเชื่อมต่อ socket
    socket.connect();
    // เมื่อ socket เชื่อมต่อเสร็จ ให้เข้าร่วมห้อง
    socket.emit('joinRoom', 'order');  // ใส่ชื่อห้องที่คุณต้องการให้เข้าร่วม
    console.log(`Client joined room: roomName`);

    // ขอข้อมูลคำสั่งซื้อล่าสุดจากเซิร์ฟเวอร์
    socket.emit('get_latest_order');

    // ฟัง event `new_order_for_staff`
    socket.on('new_order_for_staff', (latestOrders) => {
      console.log('📦 คำสั่งซื้อที่ได้รับ:', latestOrders);
      setOrders(latestOrders);
    });

    // Cleanup เมื่อ component ถูก unmount
    return () => {
      setTimeout(() => {
        socket.off('new_order_for_staff'); // หยุดฟัง event
        socket.disconnect(); // ปิดการเชื่อมต่อ
        console.log("🔴 Socket disconnected");
      }, 10000); // หน่วงเวลา 5 วินาที (5000 มิลลิวินาที)
    };
  }, []);

  const handleOpenClick = (drinkId: string) => {
    setSelectedOrderId(drinkId); // เปิด Modal พร้อมส่งค่า
  };
  const handdlecloseDetail = () => {
    setSelectedOrderId(null); // ปิด Modal
  };

  return (
    <div>
      {selectedOrderId ? (
        <div>
          {selectedOrderId && <OrderDetailsCheck _id={selectedOrderId} onClose={handdlecloseDetail} />}
        </div>
      ) : (
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            {orders.map((order) => {
              const { formattedDate, formattedTime } = formatDateTime(order.createdAt);
              return (
                <CardContent key={order._id} onClick={() => handleOpenClick(order._id)}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                    รหัสออเดอร์: #{order._id.substring(0, 6)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>ชื่อลูกค้า: {order.customer_Id.customer_Name}</Typography>
                  <Typography variant="body1" gutterBottom>สั่งเมื่อ: เวลา {formattedTime} น.  วันที่ {formattedDate}</Typography>
                  <Typography variant="body1" gutterBottom>โต๊ะ: {order.table_Id.number} จำนวนที่นั่ง {order.table_Id.seat_count}</Typography>

                  {/* ปุ่มชิดขวา */}
                  <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" sx={{ marginRight: 2 }}>ยืนยันคำสั่งซื้อ</Button>
                    <Button variant="contained" color="secondary">ยกเลิกคำสั่งซื้อ</Button>
                  </Box>
                </CardContent>
              )

            })}

          </Card>
        </Grid>)}
    </div>
  );
};

export default OrderDetailsCard;
