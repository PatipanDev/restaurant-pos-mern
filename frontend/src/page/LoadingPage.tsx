import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';

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
        <SyncLoader size={14} color='gray'/>
    </div>
  );
};


//กำหนดสไตล์
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'pink',
  },
  message: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default LoadingPage;
