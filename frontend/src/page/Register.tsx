import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Container, CssBaseline, TextField, Button, Typography } from "@mui/material";
import { Link , useNavigate }from "react-router-dom";
import axios from "axios";
import WarningAlert from "../components/AlertDivWarn";

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
      setAlertMessage(<div>✅ ลงทะเบียนสำเร็จ!</div>);

      setTimeout(() => {
        navigate("/login"); 
      }, 2000);

      // รีเซ็ตค่าในฟอร์ม
      reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessages: string[] =
          error.response?.data.errors.map((err: { msg: string }) => err.msg) || [];
        setAlertMessage(
          <div>
            <strong>❌ แจ้งเตือนข้อผิดพลาด:</strong>
            <ul>
              {errorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        console.error("Unexpected error", error);
        setAlertMessage(<div>❌ เกิดข้อผิดพลาด กรุณาลองใหม่!</div>);
      }
    }

    // ล้างข้อความแจ้งเตือนหลัง 3 วินาที
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
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
      </Container>
    </React.Fragment>
  );
};

export default Register;