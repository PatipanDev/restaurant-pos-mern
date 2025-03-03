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
// const LoadingPage = React.lazy(() => import('./page/LoadingPage'));
const Login = React.lazy(() => import('./page/Login'));
const Register = React.lazy(() => import('./page/Register'));

const App: React.FC = () => {
  const navigate = useNavigate();
  
  // useEffect(() => {
  //   // เริ่มการตรวจสอบสถานะการล็อกอินทุก 5 วินาที
  //   const interval = setInterval(() => {
  //     const isLoggedIn = localStorage.getItem('user'); // ตรวจสอบสถานะการล็อกอิน
  //     const currentPath = window.location.pathname; // เก็บเส้นทางปัจจุบัน

  //     // ถ้าผู้ใช้ไม่ได้ล็อกอินและไม่อยู่ในหน้าล็อกอินแลหน้าสมัคร ให้ไปที่หน้าล็อกอิน
  //     if (!isLoggedIn && currentPath !== '/login' && currentPath !== '/register') {
  //       navigate('/login');
  //     }

  //     // ถ้าผู้ใช้ล็อกอินแล้วและไม่อยู่ในหน้า Home ให้ไปหน้า Home
  //     if (isLoggedIn && currentPath !== '/home') {
  //       navigate('/home');
  //     }
  //   }, 5000); // ทุกๆ 5 วินาที

  //   // เคลียร์ interval เมื่อ component ถูก unmount
  //   return () => clearInterval(interval);
  // }, [navigate]);

  // import { useNavigate } from 'react-router-dom';

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        const isLoggedIn = localStorage.getItem('user');
        if (isLoggedIn) {
          console.log('User logged in');
        } else {
          console.log('User logged out');
          navigate('/login'); // ใช้ navigate ที่นี่
        }
      }
    };
  
    // หน่วงเวลา 5 วินาที ก่อนเริ่มเพิ่ม event listener
    const timeout = setTimeout(() => {
      window.addEventListener('storage', handleStorageChange);
    }, 10000); // กำหนดเวลา 5 วินาที
  
    // ตรวจสอบสถานะการล็อกอินในทันที
    const isLoggedIn = localStorage.getItem('user');
    if (isLoggedIn) {
      console.log('User logged in');
    } else {
      console.log('User logged out');
      navigate('/login'); // หรือ navigate('/register') หากไม่มีการล็อกอิน
    }
  
    return () => {
      clearTimeout(timeout); // ลบ timeout เมื่อ component ถูก unmount
      window.removeEventListener('storage', handleStorageChange); // ลบ event listener
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
