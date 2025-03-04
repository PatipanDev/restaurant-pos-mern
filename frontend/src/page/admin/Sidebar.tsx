import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Home, People, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AddEmployee from './AddEmployee'; // นำเข้า AddEmployee
import DataGridEdit from './AddEmployee';

const Sidebar: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home'); // default เป็น home

  const handleItemClick = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar ค้างที่ด้านซ้าย */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            backgroundColor: '#f5f5f5',
            color: '#333',
            paddingTop: 8,
            borderRight: '1px solid #eee',
            position: 'fixed',
            height: '100vh',
          },
        }}
      >
        <List>
          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
              },
              padding: '10px 20px',
            }}
            onClick={() => handleItemClick('home')}
          >
            <ListItemIcon sx={{ color: '#333' }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="หน้าหลัก" />
          </ListItem>

          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
              },
              padding: '10px 20px',
            }}
            onClick={() => handleItemClick('profile')}
          >
            <ListItemIcon sx={{ color: '#333' }}>
              <People />
            </ListItemIcon>
            <ListItemText primary="ผู้ใช้งาน" />
          </ListItem>

          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
              },
              padding: '10px 20px',
            }}
            onClick={() => handleItemClick('settings')}
          >
            <ListItemIcon sx={{ color: '#333' }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="การตั้งค่า" />
          </ListItem>

          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
              },
              padding: '10px 20px',
            }}
            onClick={() => handleItemClick('addEmployee')} // เชื่อมโยงไปที่ AddEmployee
          >
            <ListItemIcon sx={{ color: '#333' }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="เพิ่มพนักงาน" />
          </ListItem>

          <Divider sx={{ backgroundColor: '#eee', marginTop: 2, marginBottom: 2 }} />
        </List>
      </Drawer>

      {/* ส่วนของเนื้อหาหลัก */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        {selectedPage === 'home' && <h1>หน้าหลัก</h1>}
        {selectedPage === 'profile' && <h1>ผู้ใช้งาน</h1>}
        {selectedPage === 'settings' && <h1>การตั้งค่า</h1>}
        {selectedPage === 'addEmployee' && <DataGridEdit />} {/* แสดง AddEmployee เมื่อเลือก */}
      </div>
    </div>
  );
};

export default Sidebar;
