const API_URL = import.meta.env.VITE_API_URL;

import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
} from "@mui/material";
import { ManageAccounts, ListAlt, RamenDining, FactCheck, TableBar } from "@mui/icons-material";
import axios from "axios";

// นำเข้าหน้า
import OrderEmployee from './OrderEmployee';
import ProfileEmployee from './ProfileEmployee';
import Listfood from '../Listfood';
import LoginReminder from '../../components/LoginReminder';
import ServFood from './ServFood';
import OrderCheck from './OrderCheck';



interface User {
  user_Id: string;
  user_Name: string;
  role: string;
}



// ตรวจสอบขนาดหน้าจอ
export default function DashboardEmployee() {
  const [value, setValue] = useState(0);
  const isDesktop = useMediaQuery("(min-width:600px)"); // เช็คขนาดจอ
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate(); // ✅ เรียกใช้ useNavigate() อย่างถูกต้อง
  const location = useLocation();


  //เก็บค่าหน้าเมื่อกลับมา
  useEffect(() => {
    // หากมีค่าของ value ใน state ที่ส่งมาจากหน้าอื่น ให้ใช้ค่าเหล่านั้น
    if (location.state?.value !== undefined) {
      setValue(location.state.value);
    }
  }, [location]);

  useEffect(() => {
    //ตรวจสอบสิทธิ์ จาก http only cookie ว่ามีโทเค็นไหม
    const checkAuthorization = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user`, {
          withCredentials: true, // ส่ง cookie ไปพร้อมกับ request
        });
        console.log(response)

        if (response.status === 200) {
          setIsUser(true);
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        setIsUser(false);
      }
    };

    if(value === 4){
      
    }

    const checkUserRole = () => {
      const userFromStorage = localStorage.getItem("user");
      if (userFromStorage) {
        const parsedUser: User = JSON.parse(userFromStorage);
        const role = parsedUser.role;
        if (role) {
          redirectToDashboard(role);
        }
      }
    };

    const redirectToDashboard = (role: string) => {
      const dashboardRoutes: Record<string, string> = {
        user: "/",
        chef: "/DashboardChef",
        cashier: "/order",
        employee: "/DashboardEmployee",
        owner: "/DashboardOwner",
      };
      navigate(dashboardRoutes[role] || "/home");
    };

    checkAuthorization();
    checkUserRole();
  }, [navigate]); // ✅ เพิ่ม `navigate` ใน dependency array


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
            {[
              { label: "Food", icon: <RamenDining /> },
              { label: "Order", icon: <ListAlt /> },
              { label: "Check", icon: <FactCheck /> },
              { label: "Serv", icon: <TableBar /> },
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
        {value === 1 && (isUser ? <OrderEmployee /> : <LoginReminder />)}
        {value === 0 && <Listfood />}
        {value === 2 && (isUser ? <OrderCheck /> : <LoginReminder />)}
        {value === 3 && (isUser ? <ServFood /> : <LoginReminder />)}
        {value === 4 && (isUser ? <ProfileEmployee /> : <LoginReminder />)}
      </Box>

      {/* แสดง Bottom Navigation ถ้าเป็นจอเล็ก */}
      {!isDesktop && (
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={5}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(_, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Food" icon={<RamenDining />} />
            <BottomNavigationAction label="Order" icon={<ListAlt />} />
            <BottomNavigationAction label="Check" icon={<FactCheck />} />
            <BottomNavigationAction label="Serv" icon={<TableBar />} />
            <BottomNavigationAction label="Profile" icon={<ManageAccounts />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
