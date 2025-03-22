import { io } from 'socket.io-client';
const API_URL = import.meta.env.VITE_API_URL;
// ตั้งค่า API_URL ให้ตรงกับ backend

// เชื่อมต่อกับเซิร์ฟเวอร์ socket.io
const socket = io(API_URL, {
  withCredentials: true, // อนุญาตให้ใช้ cookies
  transports: ['websocket', 'polling'], // รองรับทั้ง WebSocket และ polling
});

export default socket;
