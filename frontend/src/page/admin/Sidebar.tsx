import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Home, People, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#f5f5f5', // สีพื้นหลังอ่อน
          color: '#333', // สีข้อความเข้มขึ้นเล็กน้อย
          paddingTop: 8,
          borderRight: '1px solid #eee', // ขอบสีอ่อน
        },
      }}
    >
      <List>
        <ListItem
          component={Link}
          to="/admin/Dashboard"
          sx={{
            '&:hover': {
              backgroundColor: '#e0e0e0', // สีพื้นหลังเมื่อ hover อ่อนลง
              borderRadius: 4,
            },
            padding: '10px 20px',
          }}
        >
          <ListItemIcon sx={{ color: '#333' }}>
            <Home />
          </ListItemIcon>
          <ListItemText primary="หน้าหลัก" />
        </ListItem>

        <ListItem
          component={Link}
          to="/profile"
          sx={{
            '&:hover': {
              backgroundColor: '#e0e0e0',
              borderRadius: 4,
            },
            padding: '10px 20px',
          }}
        >
          <ListItemIcon sx={{ color: '#333' }}>
            <People />
          </ListItemIcon>
          <ListItemText primary="ผู้ใช้งาน" />
        </ListItem>

        <ListItem
          component={Link}
          to="/addemployee"
          sx={{
            '&:hover': {
              backgroundColor: '#e0e0e0',
              borderRadius: 4,
            },
            padding: '10px 20px',
          }}
        >
          <ListItemIcon sx={{ color: '#333' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="การตั้งค่า" />
        </ListItem>

        <Divider sx={{ backgroundColor: '#eee', marginTop: 2, marginBottom: 2 }} />

        {/* คุณสามารถเพิ่มรายการอื่นๆ ได้ที่นี่ */}
      </List>
    </Drawer>
  );
};

export default Sidebar;