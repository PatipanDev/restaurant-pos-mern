import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Paper, Typography, Grid, Card, CardContent, Button, Tabs, Tab } from '@mui/material';

import OrderDetails from './OrderDetails';
import useProtectedPage from '../../ProtectedPage';
import { getUserRole } from '../../utils/userUtils';
import LoginReminder from '../../components/LoginReminder';


const orderedItems = [
  { name: 'สเต็ก', quantity: 2, price: 150 },
  { name: 'ข้าวผัด', quantity: 1, price: 60 },
  { name: 'ก๋วยเตี๋ยว', quantity: 3, price: 50 },
];

// คำนวณราคารวม
const totalPrice = orderedItems.reduce((total, item) => total + item.quantity * item.price, 0);

const Order = () => {
  const [tabIndex, setTabIndex] = useState(0); // แท็บที่เลือก
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // ลบส่วนที่เกี่ยวข้องกับการอัปเดต URL ออก
  };


  // }
  return (
    <div>
      <>
        <Typography variant="h4" gutterBottom>รายการอาหารที่สั่งแล้ว</Typography>
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="สั่งอาหาร" />
          <Tab label="กำลังดำเนินการ" />
          <Tab label="รายการที่สำเร็จ" />
          <Tab label="รายการที่ยกเลิก" />
        </Tabs>

        {tabIndex === 0 ? (
          <div>
            <OrderDetails/>
          </div>
        ) : tabIndex === 1 ? (
          <div>
            <Grid container spacing={2}>
              {/* แสดงรายการอาหารที่สั่ง */}
              {orderedItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body1">จำนวน: {item.quantity}</Typography>
                      <Typography variant="body1">ราคา: {item.price} บาท</Typography>
                      <Typography variant="body1">ราคารวม: {item.quantity * item.price} บาท</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">ราคารวมทั้งหมด: {totalPrice} บาท</Typography>
            </Box>

            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="primary">ชำระเงิน</Button>
            </Box>
          </div>
        ) : tabIndex === 2 ? (
          <div>เนื้อหาสำหรับ tab 3</div>
        ) : tabIndex === 3 ? (
          <div>เนื้อหาสำหรับ tab 4</div>
        ) : (
          <div>ไม่มีเนื้อหา</div>
        )}


      </>

    </div>
  );
};

export default Order;

