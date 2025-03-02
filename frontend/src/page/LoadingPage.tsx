import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();

  // ใช้ useEffect เพื่อให้ไปที่หน้า Home หลังจากโหลดเสร็จ
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); // ไปที่หน้า Home
    }, 3000); // 3 วินาที (คุณสามารถปรับเวลาได้ตามต้องการ)

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
        <h1>กำลังทำอาหาร...</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  message: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default LoadingPage;
