import  {  useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';
import OrderDetailsCheck from './OrderDetailsCheck';


import socket from '../../../utils/socket';
import { getEmployeeId } from '../../../utils/userUtils';
// ฟังเหตุการณ์ที่ส่งจาก server
import { formatDateTime } from '../../../utils/formatDateTime';



const OrderDetailsCardHis = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // เปิดการเชื่อมต่อ socket
    socket.connect();
    // ขอข้อมูลคำสั่งซื้อล่าสุดจากเซิร์ฟเวอร์
    if (socket.connected) {
      socket.emit('get_latest_order_his');
      console.log("==>Socket connected");
    } else {
      console.error("Socket is not connected!");
    }

    socket.on('new_order_for_staff', (latestOrders) => {
      console.log('📦 คำสั่งซื้อที่ได้รับ:', latestOrders);
      if (latestOrders) {
        setOrders(latestOrders);
      } else {
        console.error("ไม่มีคำสั่งซื้อใหม่");
      }
    });
    
  }, []);

  const handleOpenClick = (drinkId: string) => {
    setSelectedOrderId(drinkId); // เปิด Modal พร้อมส่งค่า
  };
  const handdlecloseDetail = () => {
    setSelectedOrderId(null); // ปิด Modal
  };

  const handleConfirmOrder = async (orderId: string) => {
    const isConfirmed = window.confirm("คุณต้องการยืนยันคำสั่งซื้อนี้ใช่หรือไม่?");
    if (!isConfirmed) {
      console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
      return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
    }

    const userId = getEmployeeId();
    console.log("ชื่อ", userId, "oder", orderId)
    // ส่งข้อมูลไปที่ Server เพื่อยืนยันคำสั่งซื้อ
    socket.emit('confirmOrder', { orderId, userId });

    // ฟังผลลัพธ์จาก Server
    socket.once('orderConfirmed', (order) => {
      console.log('Order confirmed successfully:', order);
      alert('ยืนยันคำสั่งซื้อสำเร็จ!');

      socket.emit('get_latest_order');

      // ฟัง event `new_order_for_staff`
      socket.on('new_order_for_staff', (latestOrders) => {
        console.log('📦 คำสั่งซื้อที่ได้รับ:', latestOrders);
        setOrders(latestOrders);
      });

    });

    socket.on('orderError', (error) => {
      console.error('Error confirming order:', error.message);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    });

  };

  const handleCancelOrder = async (orderId: string) => {
    const isConfirmed = window.confirm("คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?");
    if (!isConfirmed) {
      console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
      return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
    }

    const userId = getEmployeeId();
    console.log("ชื่อ", userId, "oder", orderId)
    // ส่งข้อมูลไปที่ Server เพื่อยืนยันคำสั่งซื้อ
    socket.emit('CancelledOrder', { orderId, userId });

    // ฟังผลลัพธ์จาก Server
    socket.once('orderCancelled', (order) => {
      console.log('Order confirmed successfully:', order);
      alert('ยกเลิกคำสั่งซื้อสำเร็จ!');

      socket.emit('get_latest_order');

      // ฟัง event `new_order_for_staff`
      socket.on('new_order_for_staff', (latestOrders) => {
        console.log('📦 คำสั่งซื้อที่ได้รับ:', latestOrders);
        setOrders(latestOrders);
      });

    });

    socket.on('orderError', (error) => {
      console.error('Error confirming order:', error.message);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    });

  };
  if (orders.length === 0) {
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
                  <Typography variant="body1" gutterBottom>ชื่อลูกค้า: {order?.customer_Id?.customer_Name}</Typography>
                  <Typography variant="body1" gutterBottom>สั่งเมื่อ: เวลา {formattedTime} น.  วันที่ {formattedDate}</Typography>
                  <Typography variant="body1" gutterBottom>โต๊ะ: {order?.table_Id?.number} จำนวนที่นั่ง {order?.table_Id?.seat_count}</Typography>

                  {/* ปุ่มชิดขวา */}
                  <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>

                    <Button
                      variant="contained"
                      color="secondary"
                      disabled
                      sx={{ marginRight: 2 }}
                      onClick={(event) => {
                        event.stopPropagation(); // ป้องกันการส่งต่อ event ไปยัง CardContent
                        handleCancelOrder(order._id);
                      }}
                    >
                      ยกเลิกคำสั่งซื้อ
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled

                      onClick={(event) => {
                        event.stopPropagation(); // ป้องกันการส่งต่อ event ไปยัง CardContent
                        handleConfirmOrder(order._id);
                      }}
                    >
                      ยืนยันคำสั่งซื้อ
                    </Button>
                  </Box>
                </CardContent>
              );
            })}
          </Card>
        </Grid>)}
    </div>
  );
};

export default OrderDetailsCardHis;
