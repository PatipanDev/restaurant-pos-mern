import React from 'react'
import { Box, CssBaseline, Paper, Typography, Grid, Card, CardContent,Button } from '@mui/material';
const orderedItems = [
  { name: 'สเต็ก', quantity: 2, price: 150 },
  { name: 'ข้าวผัด', quantity: 1, price: 60 },
  { name: 'ก๋วยเตี๋ยว', quantity: 3, price: 50 },
];

// คำนวณราคารวม
const totalPrice = orderedItems.reduce((total, item) => total + item.quantity * item.price, 0);

const Order = () => {
    return (
      <div>
        <Typography variant="h4" gutterBottom>รายการอาหารที่สั่งแล้ว</Typography>
      
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
    );
  };
  
  export default Order;

  