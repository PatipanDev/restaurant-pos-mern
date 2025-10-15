import React, { useState } from 'react';
import { Typography,  Tabs, Tab } from '@mui/material';

import OrderDetailsCard from './componentEmployee/OrderDetailsCard';
import OrderDetailsCardHis from './componentEmployee/OrderDetailsCardHis';

const OrderCheck = () => {
  const [tabIndex, setTabIndex] = useState(0); // แท็บที่เลือก

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // ลบส่วนที่เกี่ยวข้องกับการอัปเดต URL ออก
  };

  return (
    <div>
      <>
        <Typography variant="h4" gutterBottom>รายการที่ต้องตรวจสอบ</Typography>
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="ยืนยันการสั่งอาหาร" />
          <Tab label="ประวัติรายการ" />
        </Tabs>

        {tabIndex === 0 ? (
          <div>
            <OrderDetailsCard />
          </div>

        ) : tabIndex === 1 ? (
          <div>
            <OrderDetailsCardHis />
          </div>
        ) : (
          <div>ไม่มีเนื้อหา</div>
        )}


      </>

    </div>
  );
};

export default OrderCheck;

