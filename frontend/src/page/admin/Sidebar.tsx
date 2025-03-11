import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogActions, DialogTitle, DialogContent, Button } from '@mui/material';
import { Home, People, Settings, MonetizationOn, ShoppingCart, Category, LocalDining, LocalBar, Store, ExitToApp } from '@mui/icons-material';
import AddEmployee from './AddEmployee';
import DataGridEdit from './AddEmployee';
import ManageCashier from './ManageCashier';
import ManageProducts from './ManageProducts';
import ManageProductCategories from './ManageProductCategories';
import ManageUnits from './ManageUnit';
import ManageTable from './ManageTable';
import ManageDrinks from './ManageDrink';
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import SuccessAlert from '../../components/AlertSuccess';
import ManageChefs from './ManageChef';
import ManageFoods from './ManageFoods';
import ManageFoodCategories from './ManageFoodCategories';
import axios from 'axios';

const Sidebar: React.FC = () => {
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
      await axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
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
      </Drawer>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        {selectedPage === 'home' && <h1>หน้าหลัก</h1>}
        {selectedPage === 'profile' && <h1>ผู้ใช้งาน</h1>}
        {selectedPage === 'settings' && <h1>การตั้งค่า</h1>}
        {selectedPage === 'addEmployee' && <DataGridEdit />}
        {selectedPage === 'manageCashier' && <ManageCashier />}
        {selectedPage === 'manageProducts' && <ManageProducts />}
        {selectedPage === 'manageProductCategories' && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <ManageProductCategories key="firstInstance" />
            <ManageUnits key="manageUnitsInstance" />
          </div>
        )}
        {selectedPage === 'manageTables' && <ManageTable />}
        {selectedPage === 'manageDrinks' && <ManageDrinks />}
        {selectedPage === 'manageSafe' && <ManageChefs/>}
        {selectedPage === 'manageFoodType' && <ManageFoodCategories/>}

        {selectedPage === 'manageFoodMenu' && <ManageFoods/>}
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

// เมนูใน Sidebar
const menuItems = [
  { page: 'home', label: 'หน้าหลัก', icon: <Home /> },
  { page: 'profile', label: 'ผู้ใช้งาน', icon: <People /> },
  { page: 'settings', label: 'การตั้งค่า', icon: <Settings /> },
  { page: 'addEmployee', label: 'จัดการพนักงาน', icon: <Settings /> },
  { page: 'manageCashier', label: 'จัดการแคชเชียร์', icon: <MonetizationOn /> },
  { page: 'manageProducts', label: 'จัดการสินค้า', icon: <ShoppingCart /> },
  { page: 'manageProductCategories', label: 'จัดการประเภทสินค้า', icon: <Category /> },
  { page: 'manageTables', label: 'จัดการโต๊ะ', icon: <Store /> },
  { page: 'manageDrinks', label: 'จัดการเครื่องดื่ม', icon: <LocalBar /> },
  { page: 'manageFoodMenu', label: 'จัดการเมนูอาหาร', icon: <LocalDining /> },
  { page: 'manageSafe', label: 'จัดการเซฟ', icon: <MonetizationOn /> }, // ใช้ไอคอนเงิน
  { page: 'manageFoodType', label: 'จัดการประเภทอาหาร', icon: <Category /> }, // ใช้
];

export default Sidebar;