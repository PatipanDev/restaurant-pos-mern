import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Container, CssBaseline, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import WarningAlert from "../components/AlertDivWarn";

// 🟢 ประเภทข้อมูลที่ฟอร์มจะส่ง
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }} = useForm<LoginFormInputs>(); // 🎯 ใช้ react-hook-form
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);

  // 🟢 ฟังก์ชันส่งข้อมูล
const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  const { email, password } = data;

  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      customer_Email: email,
      customer_Password: password,
    });

    // ตรวจสอบว่ามี token จริงหรือไม่
    if (response.data && response.data.token) {
      const token = response.data.token;
      sessionStorage.setItem("token", token); // ✅ เก็บ token ใน sessionStorage
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem('user', JSON.stringify({ username: response.data.user})); // ✅ เก็บข้อมูลผู้ใช้
      console.log("Token:", token);

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
      setAlertMessage(error.response.data.message || 'เกิดข้อผิดพลาด');
      // setAlertMessage(<div>{String(error.response.data)}</div>);
  } else if (error.request) {
      // กรณี request ถูกส่งไปแต่ไม่ได้รับ response (เช่น server ล่ม หรือ network error)
      console.error('Request error:', error.request);
      setAlertMessage(<div>Server did not respond. Please try again later.</div>);
  } else {
      // กรณีเกิดข้อผิดพลาดใน axios เอง (เช่นตั้งค่า request ผิด)
      console.error('Error message:', error.message);
      setAlertMessage(<div>{String(error.message)}</div>);
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
              เข้าสู่ระบบ
            </Typography>

            <TextField
              label="อีเมล"
              type="email"
              {...register("email", { required: "กรุณากรอกอีเมล", pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" } })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="รหัสผ่าน"
              type="password"
              {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", m: 2 }}>
            <Button variant="contained" type="submit" color="primary" sx={{ width: "25ch" }}>
              เข้าสู่ระบบ
            </Button>

            <Link to="/register" style={{ textDecoration: "none", marginTop: "10px" }}>
              <Button variant="text" color="secondary">
                สมัครสมาชิก
              </Button>
            </Link>
          </Box>
        </Box>

        {/* ✅ แสดงแจ้งเตือนเฉพาะเมื่อเกิดข้อผิดพลาดหรือสมัครสำเร็จ */}
        <WarningAlert messagealert={alertMessage} />
      </Container>
    </React.Fragment>
  );
};

export default Login;
