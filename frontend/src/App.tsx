import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BottomNavigationComponent from './components/BottomNavigation';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { SyncLoader } from 'react-spinners';



// ใช้ React.lazy สำหรับโหลดคอมโพเนนต์แบบขี้เกียจ (lazy loading)
const Home = React.lazy(() => import('./page/Home'));
const Listfood = React.lazy(() => import('./page/Listfood'));
const Order = React.lazy(() => import('./page/Order'));
const Profile = React.lazy(() => import('./page/Profile'));
const Login = React.lazy(() => import('./page/Login'));
const Register = React.lazy(() => import('./page/Register'));
const LoginEmployee = React.lazy(()=> import('./page/LoginEmployee'))

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem("user");
      const currentPath = window.location.pathname;

      if (isLoggedIn) {
        console.log("User logged in");
    } else {
        console.log("User logged out");
        if (currentPath !== "/register" && currentPath !== "/loginemployee") {
            navigate("/login"); // ป้องกัน redirect ออกจาก register หรือ loginemployee
        }
    }
    };

    // ✅ เรียกฟังก์ชันนี้ในครั้งแรกที่ component โหลด
    checkLoginStatus();

    // ✅ ตรวจสอบเมื่อมีการเปลี่ยนแปลงค่าใน localStorage (จากแท็บอื่น)
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
    // ใช้ Suspense สำหรับการแสดงหน้าจอโหลดระหว่างการโหลดคอมโพเนนต์
    <Suspense
      fallback={
        <Box
          sx={{
            position: 'fixed',   // Fix the loader on the screen
            top: 0,              // Center vertically
            left: 0,             // Center horizontally
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // สีพื้นหลังของ UI ที่เบลอ
            backdropFilter: 'blur(5px)',  // เพิ่มความเบลอให้กับ UI
            zIndex: 9999,         // Make sure it's on top of other elements
          }}
        >
          <SyncLoader size={14} color='gray' />
        </Box>
      }
    >
      <Routes>
        {/* <Route path="/" element={<LoadingPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/listfood" element={<Listfood />} />
        <Route path="/order" element={<Order />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loginemployee" element={<LoginEmployee/>} />
      </Routes>
    </Suspense>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <App />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={4}>
        <BottomNavigationComponent />
      </Paper>
    </Router>
  );
};

export default AppWrapper;
