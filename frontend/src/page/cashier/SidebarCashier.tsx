import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogActions, DialogTitle, DialogContent, Button} from '@mui/material';
import { Home,ReceiptLong,  ExitToApp} from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL;

import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import SuccessAlert from '../../components/AlertSuccess';

import TabReceipt from './component/TabReceipt';
import HomePageCashier from './HomePageCashier';

import axios from 'axios';

const SidebarCashier: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [openDialog, setOpenDialog] = useState<boolean>(false); // เพิ่ม state สำหรับ Dialog
  const [succAlertMessage, setSuccAlertMessage] = useState<React.ReactNode | null>(null); // เพิ่ม state สำหรับ Alert

  const navigate = useNavigate(); // เพิ่ม useNavigate

  const handleItemClick = (page: string) => {
    setSelectedPage(page);
  };

  const handleLogout = () => {
    setOpenDialog(true); // เปิด Dialog เมื่อคลิกออกจากระบบ
  };

  const handleConfirm = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
      localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้
      setSuccAlertMessage(<div>ล็อกเอาท์ออกจากระบบเรียบร้อย</div>);
      setOpenDialog(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error("Logout failed", error);
    }

  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // ปิด Dialog
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#f5f5f5',
            color: '#333',
            paddingTop: 8,
            borderRight: '0.5px solid #eee',
            position: 'fixed',
            height: '100vh',
          },
        }}
      >
        {/* เมนูหลัก */}
        <ListItem onClick={() => handleItemClick('home')} sx={menuStyle(selectedPage === 'home')}>
            <ListItemIcon sx={{ color: selectedPage === 'home' ? '#FFF' : '#333' }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="หน้าหลัก" />
          </ListItem>

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
              borderRadius: 0,
              padding: '10px 20px',
            }}
          >
            <ListItemIcon sx={{ color: selectedPage === item.page ? '#FFF' : '#333' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <List>
    
          <Divider sx={{ backgroundColor: '#eee', marginTop: 2, marginBottom: 2 }} />

          <ListItem
            component="button"
            onClick={handleLogout}
            sx={{
              backgroundColor: 'transparent',
              color: '#333',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
              borderRadius: 0.1,
              padding: '10px 20px',
            }}
          >
            <ListItemIcon sx={{ color: '#333' }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="ออกจากระบบ" />
          </ListItem>
        </List>

        {/* ขนาดหน้าจอที่โชว์ */}
      </Drawer>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        {selectedPage === 'home' && <HomePageCashier/>}
    
        {selectedPage === 'payment' && <TabReceipt/>}



      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>ยืนยันการออกจากระบบ</DialogTitle>
        <DialogContent>คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleConfirm} color="secondary" autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      {succAlertMessage && <SuccessAlert successalert={succAlertMessage} />}
    </div>

  );
};


// เมนูใน Sidebar ที่โชว์
const menuItems = [
  { page: 'payment', label: 'ชำระเงิน', icon: <ReceiptLong /> },
];





// ✅ สไตล์เมนูหลัก
const menuStyle = (isSelected: boolean) => ({
  backgroundColor: isSelected ? '#4CAF50' : 'transparent',
  color: isSelected ? '#FFF' : '#333',
  '&:hover': { backgroundColor: isSelected ? '#4CAF50' : '#e0e0e0' },
  borderRadius: 0,
  padding: '10px 20px',
});


export default SidebarCashier;