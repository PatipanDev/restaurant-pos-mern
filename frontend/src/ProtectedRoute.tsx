import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


//เป็นคอมโพเน้นตรวจสอบสิทธิ์ในการเข้าถึงในแต่ละหน้า
interface User {
  user_Id: string;
  user_Name: string;
  role: string;
}

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole: string; // รับ requiredRole เพื่อกำหนดสิทธิ์ที่ต้องการ
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // เช็คว่าได้รับการอนุญาตจาก backend หรือไม่

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // เช็คสิทธิ์จาก backend ว่าผู้ใช้มีสิทธิ์เข้าใช้งานหรือไม่
        const response = await axios.get('http://localhost:3000/api/user', { withCredentials: true });

        if (response.status === 200) {
          // เช็คการอนุญาตจาก backend สำเร็จแล้ว
          setIsAuthenticated(true);

          // ดึงข้อมูลจาก localStorage เกี่ยวกับ role ของผู้ใช้
          const userFromStorage = localStorage.getItem('user');
          if (userFromStorage) {
            const parsedUser: User = JSON.parse(userFromStorage);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // ทำงานเมื่อ component mount

  if (loading) {
    return <div>Loading...</div>;  // แสดงการโหลดระหว่างที่ตรวจสอบ
  }

  if (!isAuthenticated || !user || user.role !== requiredRole) {
    // ถ้าไม่ได้รับการอนุญาตจาก backend หรือ role ไม่ตรงกับ requiredRole ให้ redirect ไปหน้า login
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;  // ถ้าได้รับการอนุญาตจาก backend และ role ตรง ให้แสดง children (คอมโพเนนต์ที่ถูกป้องกัน)
};

export default ProtectedRoute;
