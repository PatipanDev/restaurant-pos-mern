import React, { useState, useEffect, useRef, ReactNode } from "react";
import Alert from "@mui/material/Alert";


interface WarningAlertProps {
  messagealert?: ReactNode; // เปลี่ยนเป็น ReactNode เพื่อรองรับ JSX เช่น <div>...</div>
  duration?: number; // ระยะเวลาในการแสดง Alert
}

const WarningAlert: React.FC<WarningAlertProps> = ({ messagealert, duration = 3000 }) => {
  const [show, setShow] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (messagealert) {
      setShow(true); // แสดง Alert เมื่อ messagealert มีค่า

      // เล่นเสียงแจ้งเตือน
      // if (!audioRef.current) {
      //   audioRef.current = new Audio(beepSound);
      // }
      // audioRef.current.play();

      // ตั้งเวลาปิด Alert หลังจาก 3 วินาที
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setShow(false); // ซ่อน Alert หลังจากที่ตั้งเวลา
      }, duration);
    } else {
      setShow(false); // ถ้าไม่มีข้อความ, ซ่อน Alert
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [messagealert, duration]);

  if (!show) return null;

  return (
    <Alert
      severity="warning"
      sx={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        opacity: show ? 1 : 0,
        visibility: show ? "visible" : "hidden",
        transition: "opacity 0.5s ease-in-out, visibility 0s ease 0.5s",
      }}
    >
      {messagealert}
    </Alert>
  );
};

export default WarningAlert;
