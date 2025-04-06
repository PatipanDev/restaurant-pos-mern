const API_URL = import.meta.env.VITE_API_URL;

import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogActions, DialogTitle, DialogContent, Button, Collapse } from '@mui/material';
import { Home, People, Settings, Receipt, MonetizationOn,Storefront,ShoppingBasket, SettingsApplications, Category, TableRestaurant, AdminPanelSettings, LocalDining, LocalBar, Store, ExitToApp, ExpandLess, ExpandMore, AccountBox, Inventory, Inventory2} from '@mui/icons-material';

import HomePageOwner from './HomePageOwner';
import ManageEmployee from './ManageEmployee';
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
import ManageShopOwners from './ManageOwner';
import ManageFoods2 from './ManageFoods2';
import ManageSupplier from './ManageSupplier';
import ManageDoce from './ManageDoce';
import AddListProductOwner from './AddOrderProductOwner';
import SettingWebside from './SettingWebside';


import axios from 'axios';

const Sidebar: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [openDialog, setOpenDialog] = useState<boolean>(false); // เพิ่ม state สำหรับ Dialog
  const [succAlertMessage, setSuccAlertMessage] = useState<React.ReactNode | null>(null); // เพิ่ม state สำหรับ Alert
  const [openEmployeeMenu, setOpenEmployeeMenu] = useState<boolean>(false); // สำหรับเปิด/ปิดเมนูย่อย
  const [openProductMenu, setOpenProductMenu] = useState<boolean>(false); // สำหรับเปิด/ปิดเมนูย่อยสินค้า
  const [openStoreMenu, setOpenStoreMenu] = useState<boolean>(false); //สำหรับเปิด/ปิดเมนูย่อยการขาย
  const [openBuyProduct, setOpenBuyProduct] = useState<boolean>(false); //สำหรับเปิด/ปิดเมนูย่อยการขาย



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
        <List>
          {/* เมนูหลัก */}
          <ListItem onClick={() => handleItemClick('home')} sx={menuStyle(selectedPage === 'home')}>
            <ListItemIcon sx={{ color: selectedPage === 'home' ? '#FFF' : '#333' }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="หน้าหลัก" />
          </ListItem>

          {/* ✅ เมนูหลัก: จัดการบัญชีพนักงาน */}
          <ListItem onClick={() => setOpenEmployeeMenu(!openEmployeeMenu)} sx={menuStyle(false)}>
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary="จัดการบัญชีพนักงาน" />
            {openEmployeeMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          {/* ✅ เมนูย่อย: จัดการพนักงาน / แคชเชียร์ / เชฟ */}
          <Collapse in={openEmployeeMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem onClick={() => handleItemClick('manageEmployee')} sx={subMenuStyle(selectedPage === 'manageEmployee')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageEmployee' ? '#FFF' : '#333' }}>
                  <People />
                </ListItemIcon>
                <ListItemText primary="พนักงาน" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageCashier')} sx={subMenuStyle(selectedPage === 'manageCashier')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageCashier' ? '#FFF' : '#333' }}>
                  <MonetizationOn />
                </ListItemIcon>
                <ListItemText primary="แคชเชียร์" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageChef')} sx={subMenuStyle(selectedPage === 'manageChef')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageChef' ? '#FFF' : '#333' }}>
                  <LocalDining />
                </ListItemIcon>
                <ListItemText primary="เชฟ" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageShopOwner')} sx={subMenuStyle(selectedPage === 'manageShopOwner')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageShopOwner' ? '#FFF' : '#333' }}>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary="เจ้าของร้าน" />
              </ListItem>
            </List>
          </Collapse>

          {/* ✅ เมนูหลัก: จัดการสินค้า */}
          <ListItem onClick={() => setOpenProductMenu(!openProductMenu)} sx={menuStyle(false)}>
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="จัดการสินค้า" />
            {openProductMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openProductMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem onClick={() => handleItemClick('manageProducts')} sx={subMenuStyle(selectedPage === 'manageProducts')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageProducts' ? '#FFF' : '#333' }}>
                  <Inventory2 />
                </ListItemIcon>
                <ListItemText primary="สินค้า" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageProductCategories')} sx={subMenuStyle(selectedPage === 'manageProductCategories')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageProductCategories' ? '#FFF' : '#333' }}>
                  <MonetizationOn />
                </ListItemIcon>
                <ListItemText primary="ประเภทสินค้า" />
              </ListItem>
            </List>
          </Collapse>

          {/* ✅ เมนูหลัก: จัดการขาย */}
          <ListItem onClick={() => setOpenStoreMenu(!openStoreMenu)} sx={menuStyle(false)}>
            <ListItemIcon>
              <Store />
            </ListItemIcon>
            <ListItemText primary="จัดการการขาย" />
            {openStoreMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openStoreMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem onClick={() => handleItemClick('manageFood')} sx={subMenuStyle(selectedPage === 'manageFood')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageFood' ? '#FFF' : '#333' }}>
                  <LocalDining />
                </ListItemIcon>
                <ListItemText primary="อาหาร" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageDrinks')} sx={subMenuStyle(selectedPage === 'manageDrinks')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageDrinks' ? '#FFF' : '#333' }}>
                  <LocalBar />
                </ListItemIcon>
                <ListItemText primary="เครื่องดื่ม" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageTables')} sx={subMenuStyle(selectedPage === 'manageTables')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageTables' ? '#FFF' : '#333' }}>
                  <TableRestaurant />
                </ListItemIcon>
                <ListItemText primary="โต๊ะ" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageFoodType')} sx={subMenuStyle(selectedPage === 'manageFoodType')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageFoodType' ? '#FFF' : '#333' }}>
                  <Category />
                </ListItemIcon>
                <ListItemText primary="ประเภทอาหาร" />
              </ListItem>

            </List>
          </Collapse>
          <Divider sx={{ backgroundColor: '#eee', marginTop: 2, marginBottom: 2 }} />

          {/* ✅ เมนูหลัก: จัดการการซื้อและเอกสาร */}
          <ListItem onClick={() => setOpenBuyProduct(!openBuyProduct)} sx={menuStyle(false)}>
            <ListItemIcon>
              <Storefront/>
            </ListItemIcon>
            <ListItemText primary="สั่งสินค้าและเอกสาร" />
            {openBuyProduct ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openBuyProduct} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

            <ListItem onClick={() => handleItemClick('addlistproductowner')} sx={subMenuStyle(selectedPage === 'addlistproductowner')}>
                <ListItemIcon sx={{ color: selectedPage === 'addlistproductowner' ? '#FFF' : '#333' }}>
                  <Receipt />
                </ListItemIcon>
                <ListItemText primary="รายการซื้อสินค้า" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('managedoce')} sx={subMenuStyle(selectedPage === 'managedoce')}>
                <ListItemIcon sx={{ color: selectedPage === 'managedoce' ? '#FFF' : '#333' }}>
                <ShoppingBasket/>
                </ListItemIcon>
                <ListItemText primary="สั่งซื้อสินค้า" />
              </ListItem>

              <ListItem onClick={() => handleItemClick('manageSupplier')} sx={subMenuStyle(selectedPage === 'manageSupplier')}>
                <ListItemIcon sx={{ color: selectedPage === 'manageSupplier' ? '#FFF' : '#333' }}>
                  <Storefront />
                </ListItemIcon>
                <ListItemText primary="จัดการร้านจัดหาสินค้า" />
              </ListItem>

            </List>
          </Collapse>
          <Divider sx={{ backgroundColor: '#eee', marginTop: 2, marginBottom: 2 }} />

          <List />
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

         {/* ขนาดหน้าจอที่โชว์ */}
      </Drawer>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
        {selectedPage === 'home' && <h1><HomePageOwner/></h1>}
        {selectedPage === 'profile' && <h1>ผู้ใช้งาน</h1>}
        {/* {selectedPage === 'settings' && <h1>การตั้งค่า</h1>} */}
        {selectedPage === 'manageEmployee' && <ManageEmployee />}
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
        {selectedPage === 'manageChef' && <ManageChefs />}
        {selectedPage === 'manageFoodType' && <ManageFoodCategories />}

        {selectedPage === 'manageFood' && <ManageFoods />}
        {selectedPage === 'manageShopOwner' && <ManageShopOwners />}
        {selectedPage === 'managefoods2' && <ManageFoods2 />}

        {/* สั่งสินค้า */}
        {selectedPage === 'manageSupplier' && <ManageSupplier />}
        {selectedPage === 'managedoce' && <ManageDoce />}
        {selectedPage === 'addlistproductowner' && <AddListProductOwner />}
        {selectedPage === 'settingsweb' && <SettingWebside />}

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
  { page: 'settingsweb', label: 'ตั้งค่าร้านค้า', icon: <SettingsApplications /> },
  { page: 'profile', label: 'ผู้ใช้งาน', icon: <People /> },
  { page: 'managefoods2', label: 'จัดการอาหาร', icon: <People /> },
];


// ✅ สไตล์เมนูหลัก
const menuStyle = (isSelected: boolean) => ({
  backgroundColor: isSelected ? '#4CAF50' : 'transparent',
  color: isSelected ? '#FFF' : '#333',
  '&:hover': { backgroundColor: isSelected ? '#4CAF50' : '#e0e0e0' },
  borderRadius: 0,
  padding: '10px 20px',
});

// ✅ สไตล์เมนูย่อย
const subMenuStyle = (isSelected: boolean) => ({
  backgroundColor: isSelected ? '#4CAF50' : 'transparent',
  color: isSelected ? '#FFF' : '#333',
  paddingLeft: 4,
  '&:hover': { backgroundColor: isSelected ? '#4CAF50' : '#e0e0e0' },
});

export default Sidebar;