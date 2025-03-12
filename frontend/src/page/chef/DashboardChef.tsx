import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import SidebarChef from './SidebarChef';
import { Outlet } from 'react-router-dom'; // ใช้ Outlet เพื่อแสดงหน้าใหม่ภายใน Dashboard
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';



const DashboardChef: React.FC = () => {
    const navigate = useNavigate();
  



  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarChef /> {/* Sidebar จะคงอยู่ */}
      
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

export default DashboardChef;
