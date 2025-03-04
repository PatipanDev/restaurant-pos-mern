import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // ใช้ Outlet เพื่อแสดงหน้าใหม่ภายใน Dashboard

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar จะคงอยู่ */}
      
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

export default Dashboard;
