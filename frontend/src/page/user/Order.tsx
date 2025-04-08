import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Paper, Typography, Grid, Card, CardContent, Button, Tabs, Tab } from '@mui/material';

import OrderDetails from './OrderDetails';
import OrderInProgress from './OrderInProgress';
import OrderCompleted from './OrderCompleted';
import OrderCancelled from './OrderCancelled';


const Order: React.FC = () => {
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
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="order tabs"
        >
          <Tab label="สั่งอาหาร" />
          <Tab label="กำลังดำเนินการ" />
          <Tab label="รายการที่สำเร็จ" />
          <Tab label="รายการที่ยกเลิก" />
        </Tabs>

        {tabIndex === 0 ? (
          <div>
            <OrderDetails />
          </div>
        ) : tabIndex === 1 ? (
          <div>
            <OrderInProgress />
          </div>
        ) : tabIndex === 2 ? (
          <div>
            <OrderCompleted />
          </div>
        ) : tabIndex === 3 ? (
          <div>
            <OrderCancelled />
          </div>
        ) : (
          <div>ไม่มีเนื้อหา</div>
        )}


      </>

    </div>
  );
};

export default Order;

