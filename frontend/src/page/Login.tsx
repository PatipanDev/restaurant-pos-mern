import React, { useState } from 'react';
import { Box, Container, CssBaseline, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ฟังก์ชันในการจัดการการส่งฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // ใส่ฟังก์ชันสำหรับการเข้าสู่ระบบที่นี่
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 2, width: '28ch' },
            padding: 4,                  // เพิ่ม padding เพื่อให้ฟอร์มมีพื้นที่รอบๆ
            borderRadius: 2,             // มุมโค้งมน
            boxShadow: 3,                // กำหนดเงา
            maxWidth: 300,               // กำหนดความกว้างสูงสุด
            margin: '0 auto',            // จัดให้ฟอร์มอยู่กลาง
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit} // เมื่อส่งฟอร์ม
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight={800}>
              เข้าสู่ระบบ
            </Typography>
            {/* ฟิลด์อีเมล */}
            <TextField
              id="outlined-email"
              label="อีเมล"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            {/* ฟิลด์รหัสผ่าน */}
            <TextField
              id="outlined-password-input"
              label="รหัสผ่าน"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
            {/* ปุ่มเข้าสู่ระบบ */}
            <Button variant="contained" type="submit" color="primary" sx={{ width: '25ch' }}>
              เข้าสู่ระบบ
            </Button>

            {/* ลิงก์ไปหน้าสมัครสมาชิก */}
            <Link to="/register" style={{ textDecoration: 'none', marginTop: '10px' }}>
              <Button variant="text" color="secondary">
                สมัครสมาชิก
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Login;
