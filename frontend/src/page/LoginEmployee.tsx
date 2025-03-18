const API_URL = import.meta.env.VITE_API_URL;

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Container, CssBaseline, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import WarningAlert from "../components/AlertDivWarn";
import SuccessAlert from "../components/AlertSuccess";
// import LoginEmployee from './LoginEmployee';

axios.defaults.withCredentials = true; 

interface LoginProps {
  setAuth?: (auth: boolean) => void;
}

// 🟢 ประเภทข้อมูลที่ฟอร์มจะส่ง
interface LoginFormInputs {
  name: string; // เปลี่ยนเป็นชื่อ
  password: string;
  role: string;  // เพิ่มตัวแปร role สำหรับตำแหน่ง
}

const LoginEmployee: React.FC<LoginProps> = ({ setAuth }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }} = useForm<LoginFormInputs>(); // 🎯 ใช้ react-hook-form
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  // 🟢 ฟังก์ชันส่งข้อมูลเข้าสู่ระบบ
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { name, password, role } = data;
    // console.log(data)

    try {
      const response = await axios.post(`${API_URL}/api/auth/loginemployee`, {
        employee_Name: name,  // เปลี่ยนเป็นชื่อสำหรับพนักงาน
        employee_Password: password,
        employee_Role: role,  // ส่งค่าตำแหน่งไปด้วย
      },{withCredentials: true});

      console.log("📌 Response จาก API:", response.data); // ✅ Debug จุดนี้

      if (response.data.success) {
        //รับค่าระดับ
        const userRole = response.data.user.role;
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setAlertSuccess(<div>เข้าสู่ระบบเรียบร้อย</div>);

        setAuth?.(true);
        //นำทางไป
        const dashboardRoutes: Record<string, string> = {
          chef: '/DashboardChef',
          cashier: '/order',
          employee: '/profile',
          owner: '/DashboardOwner'
        };

        setTimeout(() => {
          navigate(dashboardRoutes[userRole] || '/home'); // ถ้าไม่มี role ที่กำหนดจะพาไปหน้า home
        }, 2000);
      } else {
        console.warn("Login ไม่สำเร็จ");
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        setAlertMessage(<div>{error.response.data.message}</div>);
      } else if (error.request) {
        setAlertMessage(<div>Server ไม่ตอบสนอง โปรดลองใหม่</div>);
      } else {
        setAlertMessage(<div>{error.message}</div>);
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline/>
      <Container fixed style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 2, width: "28ch" },
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 300,
            margin: "0 auto",
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", m: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight={800}>
              เข้าสู่ระบบพนักงาน
            </Typography>

            <TextField
              label="ชื่อ" // เปลี่ยนจาก "อีเมล" เป็น "ชื่อ"
              type="text"  // ใช้ type="text" แทน "email"
              {...register("name", { required: "กรุณากรอกชื่อ" })} // เปลี่ยนจาก "email" เป็น "name"
              error={!!errors.name} // ใช้ "name" ในการตรวจสอบ error
              helperText={errors.name?.message}
            />
            <TextField
              label="รหัสผ่าน"
              type="password"
              {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                ตำแหน่ง
              </InputLabel>
              <NativeSelect
                defaultValue={1}
                {...register("role", { required: "กรุณาเลือกตำแหน่ง" })}
                inputProps={{
                  name: 'role',
                  id: 'uncontrolled-native',
                }}
              >
                <option value={"employee"}>พนักงาน</option>
                <option value={"cashier"}>แคชเชียร์</option>
                <option value={"chef"}>เชฟ</option>
                <option value={"owner"}>เจ้าของร้าน</option>
              </NativeSelect>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", m: 2 }}>
            <Button variant="contained" type="submit" color="primary" sx={{ width: "25ch" }}>
              เข้าสู่ระบบ
            </Button>
            <Link to="/login" style={{ textDecoration: "none", marginTop: "10px" }}>
              <Button variant="text" color="secondary">
                เข้าสู่ระบบลูกค้า
              </Button>
            </Link>
          </Box>
        </Box>

        {/* ✅ แสดงแจ้งเตือนเฉพาะเมื่อเกิดข้อผิดพลาดหรือสมัครสำเร็จ */}
        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess}/>
      </Container>
    </React.Fragment>
  );
};

export default LoginEmployee;
