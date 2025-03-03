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

// 🟢 ประเภทข้อมูลที่ฟอร์มจะส่ง
interface LoginFormInputs {
  name: string; // เปลี่ยนเป็นชื่อ
  password: string;
  role: string;  // เพิ่มตัวแปร role สำหรับตำแหน่ง
}

const LoginEmployee = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }} = useForm<LoginFormInputs>(); // 🎯 ใช้ react-hook-form
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  // 🟢 ฟังก์ชันส่งข้อมูล
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { name, password, role } = data;

    try {
      const response = await axios.post('http://localhost:3000/api/auth/loginemployee', {
        employee_Name: name,  // เปลี่ยนเป็นชื่อสำหรับพนักงาน
        employee_Password: password,
        employee_Role: role,  // ส่งค่าตำแหน่งไปด้วย
      });

      // ตรวจสอบว่ามี token จริงหรือไม่
      if (response.data && response.data.token) {
        const token = response.data.token;
        sessionStorage.setItem("token", token); // ✅ เก็บ token ใน sessionStorage
        localStorage.setItem('user', JSON.stringify({ username: response.data.user, role: response.data.role})); // ✅ เก็บข้อมูลผู้ใช้และตำแหน่ง
        console.log("Token:", token);
        setAlertSuccess(<div>เข้าสู่ระบบเรียบร้อย</div>);

        setTimeout(() => {
          navigate("/home"); 
        }, 2000);
      } else {
        console.warn("ไม่มี Token ที่ได้รับจากเซิร์ฟเวอร์");
      }

    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        // กรณีเซิร์ฟเวอร์ตอบกลับแต่มี error (เช่น 400, 500)
        setAlertMessage(<div>{error.response.data.message}</div>);
      } else if (error.request) {
        // กรณี request ถูกส่งไปแต่ไม่ได้รับ response (เช่น server ล่ม หรือ network error)
        console.error('Request error:', error.request);
        setAlertMessage(<div>Server did not respond. Please try again later.</div>);
      } else {
        // กรณีเกิดข้อผิดพลาดใน axios เอง (เช่นตั้งค่า request ผิด)
        console.error('Error message:', error.message);
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
                <option value={1}>พนักงาน</option>
                <option value={2}>แคชเชียร์</option>
                <option value={3}>เชฟ</option>
                <option value={4}>เจ้าของร้าน</option>
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
