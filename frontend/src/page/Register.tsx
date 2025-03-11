import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Container, CssBaseline, TextField, Button, Typography } from "@mui/material";
import { Link , useNavigate }from "react-router-dom";
import axios from "axios";
import WarningAlert from "../components/AlertDivWarn";
import SuccessAlert from "../components/AlertSuccess";

// 🟢 ประเภทข้อมูลที่ฟอร์มจะส่ง
interface RegisterFormInputs {
  username: string;
  email: string;
  phone: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate(); 
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormInputs>(); // 🎯 ใช้ react-hook-form
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
 const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
  // 🟢 ฟังก์ชันส่งข้อมูล
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      console.log("Sending data:", data);
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        customer_Name: data.username,
        customer_Email: data.email,
        customer_Password: data.password,
        customer_Telnum: data.phone,
      });

      console.log("Registration Successful", response.data);
     
      setAlertSuccess(<div>✅ ลงทะเบียนสำเร็จ!</div>);

      setTimeout(() => {
        navigate("/login"); 
      }, 2000);

      // รีเซ็ตค่าในฟอร์ม
      reset();
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        // กรณีเซิร์ฟเวอร์ตอบกลับแต่มี error (เช่น 400, 500)
        setAlertMessage(<div>{error.response.data.message}</div>);
        // setAlertMessage(<div>{String(error.response.data)}</div>);
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
      <CssBaseline />
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
              สมัครสมาชิก
            </Typography>

            <TextField
              label="ชื่อผู้ใช้"
              type="text"
              {...register("username", { required: "กรุณากรอกชื่อผู้ใช้" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              label="อีเมล"
              type="email"
              {...register("email", { required: "กรุณากรอกอีเมล", pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" } })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="เบอร์โทรศัพท์"
              type="tel"
              {...register("phone", { required: "กรุณากรอกเบอร์โทรศัพท์" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField
              label="รหัสผ่าน"
              type="password"
              {...register("password", { required: "กรุณากรอกรหัสผ่าน", minLength: { value: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" } })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", m: 2 }}>
            <Button variant="contained" type="submit" color="primary" sx={{ width: "25ch" }}>
              สมัครสมาชิก
            </Button>

            <Link to="/login" style={{ textDecoration: "none", marginTop: "10px" }}>
              <Button variant="text" color="secondary">
                เข้าสู่ระบบ
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

export default Register;