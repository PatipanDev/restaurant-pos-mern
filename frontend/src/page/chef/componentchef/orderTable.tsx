import  { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Box, Typography } from '@mui/material';
import socket from '../../../utils/socket';
import { formatDateTime } from '../../../utils/formatDateTime';
import { getEmployeeId } from '../../../utils/userUtils';
const userId = getEmployeeId();

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

const translateStatus = (status: string) => {
  switch (status) {
    case 'Pending':
      return (
        <span style={{ color: 'orange' }}>
          <span role="img" aria-label="pending">⏳</span> รอดำเนินการ
        </span>
      );
    case 'In Progress':
      return (
        <span style={{ color: 'blue' }}>
          <span role="img" aria-label="in-progress">🔄</span> กำลังดำเนินการ
        </span>
      );
    case 'On Hold':
      return (
        <span style={{ color: 'gray' }}>
          <span role="img" aria-label="on-hold">⏸️</span> เสร็จสิ้น
        </span>
      );
    case 'Completed':
      return (
        <span style={{ color: 'green' }}>
          <span role="img" aria-label="completed">✔️</span> เสร็จสิ้น
        </span>
      );
    case 'Cancelled':
      return (
        <span style={{ color: 'red' }}>
          <span role="img" aria-label="cancelled">❌</span> ยกเลิก
        </span>
      );
    default:
      return status; // ถ้าสถานะไม่ตรงกับที่กำหนด, ให้แสดงสถานะเดิม
  }
};



const OrderTable = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null); // ใช้ในการเก็บการเลือกออเดอร์
  const [ordersfood, setOrderFood] = useState<OrderFoodDetail[]>([]);
  console.log("ordersfood:", ordersfood);
  console.log("Type of ordersfood:", typeof ordersfood);
  console.log("Is ordersfood an array?", Array.isArray(ordersfood));

  useEffect(() => {
    // เมื่อเชื่อมต่อ socket และขอข้อมูล
    socket.connect();
    // ขอข้อมูลคำสั่งซื้อล่าสุดจากเซิร์ฟเวอร์
    if (socket.connected) {
      console.log("==>Socket connected");
    } else {
      console.error("Socket is not connected!");
    }
    console.log(ordersfood)

    socket.emit('getOrderFoodDetails');

    socket.on('orderFoodDetails', (orderDetails) => {
      if (!orderDetails || orderDetails.length === 0) {
        console.warn("⚠️ No order details received");
        setOrderFood([]); // ตั้งค่าเป็น [] ถ้าไม่มีข้อมูล
      } else {
        console.log('📦 Received order food details:', orderDetails);
        setOrderFood(orderDetails);
      }
    });
  }, [])


  const handleStartCooking = (orderId: string) => {
    const isConfirmed = window.confirm("คุณต้องการยืนยันว่าจะทำอาหารนี้ใช่ไหมสั่งซื้อนี้ใช่หรือไม่?");
    if (!isConfirmed) {
      console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
      return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
    }

    const userId = getEmployeeId();
    console.log("ชื่อ", userId, "oder", orderId)
    // ส่งข้อมูลไปที่ Server เพื่อยืนยันคำสั่งซื้อ
    socket.emit('startCooking', { orderId, userId });

    // ฟังผลลัพธ์จาก Server
    socket.once('startConfirmed', (cooking) => {
      console.log('Cooking confirmed successfully:', cooking);

      socket.emit('getOrderFoodDetails');

      socket.on('orderFoodDetails', (orderDetails) => {
        if (!orderDetails || orderDetails.length === 0) {
          console.warn("⚠️ No order details received");
          setOrderFood([]); // ตั้งค่าเป็น [] ถ้าไม่มีข้อมูล
        } else {
          console.log('📦 Received order food details:', orderDetails);
          setOrderFood(orderDetails);
        }
      });

    });

    socket.on('orderError', (error) => {
      console.error('Error confirming order:', error.message);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    });
    // ส่งคำสั่งเริ่มทำอาหารไปที่ server
  };

  const handleConfirmOrder = (orderId: string) => {
    const isConfirmed = window.confirm("คุณต้องการยืนยันว่าทำอาหารเสร็จใช่หรือไม่?");
    if (!isConfirmed) {
      console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
      return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
    }

    const userId = getEmployeeId();
    console.log("ชื่อ", userId, "oder", orderId)
    // ส่งข้อมูลไปที่ Server เพื่อยืนยันคำสั่งซื้อ
    socket.emit('FinishCooking', { orderId, userId });

    // ฟังผลลัพธ์จาก Server
    socket.once('FinishConfirmed', (cooking) => {
      console.log('Cooking Finish fconfirmed successfully 👌👌:', cooking);
      socket.emit('getOrderFoodDetails');

      socket.on('orderFoodDetails', (orderDetails) => {
        if (!orderDetails || orderDetails.length === 0) {
          console.warn("⚠️ No order details received");
          setOrderFood([]); // ตั้งค่าเป็น [] ถ้าไม่มีข้อมูล
        } else {
          console.log('📦 Received order food details:', orderDetails);
          setOrderFood(orderDetails);
        }
      });
    });

    socket.on('orderError', (error) => {
      console.error('Error confirming order:', error.message);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    });


    // ส่งคำสั่งยืนยันไปที่ server
  };

  if (ordersfood.length === 0) {
    return (
      <div>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="body1" align="center">
            ไม่มีรายการที่ลูกค้าสั่งมา
          </Typography>
        </Box>
      </div>
    )
  }
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
            {ordersfood.map((order, index) => {
              const { formattedDate, formattedTime } = formatDateTime(order.createdAt);
              return (
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
                  <TableCell>{translateStatus(order.orderDetail_Cooking)}</TableCell>
                  <TableCell>{order.chef_Id?.chef_Name || "ไม่มี"}</TableCell>
                  <TableCell>{formattedTime} วัน {formattedDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleStartCooking(order._id)}
                      disabled={order.orderDetail_Cooking !== "Pending"} // ปิดปุ่มเมื่อสถานะไม่ใช่ "Pending"
                    >
                      เริ่มทำ
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleConfirmOrder(order._id)}
                      disabled={order.orderDetail_Cooking !== "In Progress" || String(order.chef_Id) === String(userId)}
                    >
                      ยืนยัน
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>

  );
};

export default OrderTable;
