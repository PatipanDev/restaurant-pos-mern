import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Paper, Typography, Grid, Card, CardContent, Button, Tabs, Tab, Divider } from '@mui/material';

import CashierPayment from '../CashierPayment';
import CashierPaymentFinish from '../CashierPaymentfinish';

const TabReceipt = () => {
  const [tabIndex, setTabIndex] = useState(0); // แท็บที่เลือก
  const navigate = useNavigate();

  // const protection = useProtectedPage(getUserRole());  // เรียกใช้งานฟังก์ชัน
  // console.log('ระดับผู้ใช้',getUserRole())



  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // ลบส่วนที่เกี่ยวข้องกับการอัปเดต URL ออก
  };

  return (
    <div>
      <>
        <Box sx={{margin: 1 ,marginLeft: 4 }}>
        <Typography variant="h4" >หน้าขาย</Typography>

        </Box>
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="ตรวจสอบรายการ" />
          <Tab label="ประวัติรายการ" />
        </Tabs>

        {tabIndex === 0 ? (
          <div>
            <CashierPayment/>
          </div>

        ) : tabIndex === 1 ? (
          <div>
            <CashierPaymentFinish/>
          </div>
        ) : (
          <div>ไม่มีเนื้อหา</div>
        )}


      </>

    </div>
  );
};

export default TabReceipt;

