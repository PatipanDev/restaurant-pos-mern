import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import beepSound from '../assets/sound/beep-warning.mp3';

interface WarningAlertProps {
  message?: string; // กำหนดประเภทให้ message เป็น string หรือ undefined
}

const WarningAlert: React.FC<WarningAlertProps> = ({ message }) => {
  const [show, setShow] = useState(false); // ใช้ state เพื่อควบคุมการแสดง Alert

  useEffect(() => {
    if (message) {
      setShow(true); // แสดง Alert ทุกครั้งที่ message เปลี่ยน

      // เล่นเสียงเอฟเฟกต์

      const audio = new Audio(beepSound);
      audio.play();

      const timer = setTimeout(() => {
        setShow(false); // ซ่อน Alert หลังจาก 3 วินาที
      }, 3000);

      return () => clearTimeout(timer); // เคลียร์ timeout เมื่อคอมโพเนนต์ถูก unmount
    }
  }, [message]); // เมื่อ message เปลี่ยน จะทำให้การแสดง Alert รีเซ็ตใหม่

  if (!message || !show) return null;

  return (
    <Alert
      severity="warning"
      sx={{
        position: 'fixed', // ตำแหน่งลอย
        top: 20,            // ตั้งตำแหน่งจากด้านบน
        left: '50%',        // กำหนดให้มาหมุนที่กลางจอ
        transform: 'translateX(-50%)', // ย้ายตำแหน่งให้ตรงกลาง
        zIndex: 9999,       // ตั้งค่าระดับการแสดงผลให้สูง
      }}
    >
      {message}
    </Alert>
  );
};

export default WarningAlert;
