import * as React from 'react';
import { Box, CssBaseline, Paper, Typography } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Home, ManageAccounts, ListAlt, RamenDining } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NestedList from './Profile'; // คอมโพเนนต์โปรไฟล์
import { useState,useEffect } from 'react';

// สร้างคอมโพเนนต์สำหรับแต่ละหน้า
const HomePageContent = () => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h4">Home Page</Typography>
    <Typography variant="body1">This is the content of Home Page</Typography>
  </Box>
);

const FoodPageContent = () => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h4">Food Page</Typography>
    <Typography variant="body1">This is the content of Food Page</Typography>
  </Box>
);

const OrderPageContent = () => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h4">Order Page</Typography>
    <Typography variant="body1">This is the content of Order Page</Typography>
  </Box>
);

const ProfilePageContent = () => (
  <Box sx={{ padding: 2 }}>
    <NestedList/>
    <Typography variant="h4">Profile Page</Typography>
    <Typography variant="body1">This is the content of Profile Page</Typography>
  </Box>
);


export default function HomePage() {
  const [value, setValue] = React.useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem("user");
      const currentPath = window.location.pathname;

      if (isLoggedIn) {
        const user = JSON.parse(isLoggedIn);
        if (user.role === "4") { // ตัวอย่างการแยกผู้ใช้ admin
          setShowBottomNav(false);
        } else {
          setShowBottomNav(true);
        }
      } else {
        if (currentPath !== "/register" && currentPath !== "/loginemployee") {
          navigate("/login"); // เปลี่ยนเส้นทางไปหน้า login ถ้าผู้ใช้ไม่ได้ล็อกอิน
        }
      }
    };

    checkLoginStatus();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      {/* Render different content based on the current page */}
      {value === 0 && <HomePageContent />}
      {value === 1 && <FoodPageContent />}
      {value === 2 && <OrderPageContent />}
      {value === 3 && <ProfilePageContent />}

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={4}>
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
    </Box>
  );
}
