import React, { useState } from 'react';
import { Box, Container, CssBaseline, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
// import { registerUser } from '../api/api';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import WarningAlert from '../components/Alert';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setErrorMessage(''); // เคลียร์ข้อความผิดพลาดก่อนการตรวจสอบ
    console.log("Cleared previous error message");
  

    const userData = {
      customer_Name: username, 
      customer_Email: email, 
      customer_Password: password, 
      customer_Telnum: phone
    };
  
    await handleRegister(userData);
  };

  const handleRegister = async (userData: { customer_Name: string; customer_Email: string; customer_Password: string; customer_Telnum: string }) => {
    try {
      console.log(userData)
      const response = await axios.post('http://localhost:3000/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Registration Successful', response.data);
    } catch (error: unknown) {  // ระบุว่า error เป็น type 'unknown'
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
        console.error('Error during registration:', error.response?.data);
      } else {
        setErrorMessage('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 2, width: '28ch' },
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 300,
            margin: '0 auto',
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight={800}>
              สมัครสมาชิก
            </Typography>

            <TextField
              id="outlined-username"
              label="ชื่อผู้ใช้"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              id="outlined-email"
              label="อีเมล"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <TextField
              id="outlined-phone"
              label="เบอร์โทรศัพท์"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <TextField
              id="outlined-password-input"
              label="รหัสผ่าน"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
            <Button variant="contained" type="submit" color="primary" sx={{ width: '25ch' }}>
              สมัครสมาชิก
            </Button>

            <Link to="/login" style={{ textDecoration: 'none', marginTop: '10px' }}>
              <Button variant="text" color="secondary">
                เข้าสู่ระบบ
              </Button>
            </Link>
            {errorMessage && <WarningAlert message={errorMessage} />}
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Register;
