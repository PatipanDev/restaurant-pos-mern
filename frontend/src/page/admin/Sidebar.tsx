import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Home, People, Settings, MonetizationOn } from '@mui/icons-material';
import AddEmployee from './AddEmployee';
import DataGridEdit from './AddEmployee';
import ManageCashier from './ManageCashier';

const Sidebar: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');

  const handleItemClick = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
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
          {menuItems.map((item) => (
            <ListItem
              key={item.page}
              onClick={() => handleItemClick(item.page)}
              sx={{
                backgroundColor: selectedPage === item.page ? '#4CAF50' : 'transparent',
                color: selectedPage === item.page ? '#FFF' : '#333',
                '&:hover': {
                  backgroundColor: selectedPage === item.page ? '#4CAF50' : '#e0e0e0',
                },
                borderRadius: 4,
                padding: '10px 20px',
              }}
            >
              <ListItemIcon sx={{ color: selectedPage === item.page ? '#FFF' : '#333' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}

          <Divider sx={{ backgroundColor: '#eee', marginTop: 2, marginBottom: 2 }} />
        </List>
      </Drawer>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        {selectedPage === 'home' && <h1>หน้าหลัก</h1>}
        {selectedPage === 'profile' && <h1>ผู้ใช้งาน</h1>}
        {selectedPage === 'settings' && <h1>การตั้งค่า</h1>}
        {selectedPage === 'addEmployee' && <DataGridEdit />}
        {selectedPage === 'manageCashier' && <ManageCashier />}
      </div>
    </div>
  );
};

// เมนูใน Sidebar
const menuItems = [
  { page: 'home', label: 'หน้าหลัก', icon: <Home /> },
  { page: 'profile', label: 'ผู้ใช้งาน', icon: <People /> },
  { page: 'settings', label: 'การตั้งค่า', icon: <Settings /> },
  { page: 'addEmployee', label: 'เพิ่มพนักงาน', icon: <Settings /> },
  { page: 'manageCashier', label: 'ManageCashier', icon: <MonetizationOn /> },
];

export default Sidebar;
