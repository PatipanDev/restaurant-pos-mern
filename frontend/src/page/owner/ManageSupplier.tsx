import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Paper, Typography, Grid, Card, CardContent, Button, Tabs, Tab, Divider } from '@mui/material';

import ShopSupplier from './component/ShopSupplier';
import EmployeeSupplier from './component/EmployeeSupplier';


// คำนวณราคารวม

const ManageSupplier = () => {
  const [tabIndex, setTabIndex] = useState(0); // แท็บที่เลือก

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // ลบส่วนที่เกี่ยวข้องกับการอัปเดต URL ออก
  };

  return (
    <div>
      <>
        <Typography variant="h4" gutterBottom sx={{margin: 1, marginLeft: 2}}>จัดการร้านค้าจัดหาสินค้า</Typography>
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="จัดการร้านค้าจัดหาสินค้า" />
          <Tab label="จัดการพนักร้านค้าจัดหาสินค้า" />
        </Tabs>

        {tabIndex === 0 ? (
          <div>
            <ShopSupplier/>
          </div>

        ) : tabIndex === 1 ?(
          <div>
            <EmployeeSupplier/>
          </div>
        ) : null
        }
      </>

    </div>
  );
};

export default ManageSupplier;


