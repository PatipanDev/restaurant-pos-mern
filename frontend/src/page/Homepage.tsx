import * as React from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Home, ManageAccounts, ListAlt, RamenDining } from "@mui/icons-material";
import axios from "axios";

// นำเข้าหน้า
import Profile from "./Profile";
import Order from "./Oder";
import Listfood from "./Listfood1";
import HomeIndex from "./Homeindex";
import LoginReminder from "./admin/component/LoginReminder";

// ใช้ไลบรารีต่าง ๆ
import Cookies from "js-cookie";  // ใช้ js-cookie
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  customer_Id: string;
  customer_Name: string;
  role: string;  // เพิ่มการกำหนดชนิดข้อมูล role
  iat: number;
  exp: number;
}

// ตรวจสอบขนาดหน้าจอ
export default function HomePage() {
  const [value, setValue] = React.useState(0);
  const isDesktop = useMediaQuery("(min-width:600px)"); // จอใหญ่ (600px ขึ้นไป)
  const [isUser, setIsUser] = React.useState(false); // ใช้ state สำหรับเก็บสถานะ


  React.useEffect(() => {
  const checkAuthorization = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user', { 
        withCredentials: true // ส่ง cookie ไปพร้อมกับ request
      });
      console.log(response)

      // ถ้าผ่านการตรวจสอบสิทธิ์จากเซิร์ฟเวอร์
      if (response.status === 200) {
        setIsUser(true);
      }
    } catch (error) {
      console.error("Authorization failed:", error);
      setIsUser(false); // ถ้าการตรวจสอบไม่ผ่าน
    }
  };

  checkAuthorization();
}, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* แสดง Sidebar ถ้าเป็นจอใหญ่ */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
          }}
        >
          <List>
            {[{ label: "Home", icon: <Home /> },
              { label: "Food", icon: <RamenDining /> },
              { label: "Order", icon: <ListAlt /> },
              { label: "Profile", icon: <ManageAccounts /> }
            ].map((item, index) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => setValue(index)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}

      {/* Content */}
      <Box sx={{ flexGrow: 2, p: 1 }}>
        {value === 0 && <HomeIndex />}
        {value === 1 && (isUser ? <Listfood /> : <LoginReminder />)}
        {value === 2 && (isUser ? <Order /> : <LoginReminder />)}
        {value === 3 && (isUser ? <Profile /> : <LoginReminder/>)}
      </Box>

      {/* แสดง Bottom Navigation ถ้าเป็นจอเล็ก */}
      {!isDesktop && (
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={4}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Food" icon={<RamenDining />} />
            <BottomNavigationAction label="Order" icon={<ListAlt />} />
            <BottomNavigationAction label="Profile" icon={<ManageAccounts />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
