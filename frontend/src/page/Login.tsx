import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Container, CssBaseline, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import WarningAlert from "../components/AlertDivWarn";
import SuccessAlert from "../components/AlertSuccess";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true; // ✅ ให้ axios ส่งคุกกี้อัตโนมัติ

interface LoginProps {
  setAuth?: (auth: boolean) => void;
}

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        customer_Email: data.email,
        customer_Password: data.password,
      },{ withCredentials: true });

      console.log("📌 Response จาก API:", response.data); // ✅ Debug จุดนี้

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setAlertSuccess(<div>เข้าสู่ระบบเรียบร้อย</div>);

        setAuth?.(true);

        setTimeout(() => {
          navigate("/");
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
      <CssBaseline />
      <Container fixed style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 2, width: "28ch" }, padding: 4, borderRadius: 2, boxShadow: 3, maxWidth: 300, margin: "0 auto" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", m: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight={800}>
              เข้าสู่ระบบลูกค้า
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
            <Link to="/loginemployee" style={{ textDecoration: "none", marginTop: "10px" }}>
              <Button variant="text" color="secondary">
                เข้าสู่ระบบพนักงาน
              </Button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none", marginTop: "10px" }}>
              <Button variant="text" color="secondary">
                สมัครสมาชิก
              </Button>
            </Link>
          </Box>
        </Box>
        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess} />
      </Container>
    </React.Fragment>
  );
};

export default Login;
