import React from 'react';
import { Box, AppBar } from '@mui/material';
import SidebarCashier from './SidebarCashier';
import { Outlet } from 'react-router-dom'; // ใช้ Outlet เพื่อแสดงหน้าใหม่ภายใน Dashboard



const DashboardCashier: React.FC = () => {
    
  
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
