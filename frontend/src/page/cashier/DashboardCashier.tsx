import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import SidebarCashier from './SidebarCashier';
import { Outlet } from 'react-router-dom'; // ใช้ Outlet เพื่อแสดงหน้าใหม่ภายใน Dashboard
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';



const DashboardCashier: React.FC = () => {
    const navigate = useNavigate();
  
  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarCashier /> 
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <AppBar position="static">
            {/* <Typography variant="h6">Dashboard</Typography> */}

        </AppBar>

        {/* ใช้ Outlet เพื่อแสดงเนื้อหาของหน้าใหม่ */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardCashier;
