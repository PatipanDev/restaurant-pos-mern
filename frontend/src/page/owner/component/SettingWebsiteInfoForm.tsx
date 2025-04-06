import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, InputLabel, Typography, Grid, Alert } from "@mui/material";
import axios from "axios"; // Import axios
import React, { useState, useEffect } from 'react';
import SuccessAlert from "../../../components/AlertSuccess";
const API_URL = import.meta.env.VITE_API_URL;

interface WebsiteFormData {
  websiteName: string;
  websiteDescription: string;
  phoneNumber: string;
  eMail: string;
  facebookAccount: string;
  lineId: string;
  xAccount: string;
  instagramAccount: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  otherContact?: string;
}

const WebsiteInfoForm: React.FC = () => {
  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<WebsiteFormData>();
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<any>(null);
  const [rows, setRows] = useState<any>([]);

  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
  const fetchWebsiteInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/setting/getFormSetting`); // ดึงข้อมูลจาก backend
      const websiteData = response.data.settingweb[0]; // เลือกค่าแรกจาก array

      console.log(response);
      console.log(websiteData);

      // เซ็ตค่าลงในฟอร์ม
      reset({
        websiteName: websiteData.websiteName || "",
        websiteDescription: websiteData.websiteDescription || "",
        phoneNumber: websiteData.phoneNumber || "",
        eMail: websiteData.eMail || "",
        facebookAccount: websiteData.facebookAccount || "",
        lineId: websiteData.lineId || "",
        xAccount: websiteData.xAccount || "",
        instagramAccount: websiteData.instagramAccount || "",
        address: websiteData.address || "",
        primaryColor: websiteData.primaryColor || "#000000", // ค่า default ถ้าไม่มี
        secondaryColor: websiteData.secondaryColor || "#ffffff",
        otherContact: websiteData.otherContact || ""
      });

    } catch (error) {
      console.error("โหลดข้อมูลไม่สำเร็จ:", error);
    }
  };

  useEffect(() => {
    

    fetchWebsiteInfo();
  }, [reset]);



  const onSubmit = async (data: WebsiteFormData) => {
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
      // ตัวอย่างการส่งข้อมูลไปยัง API endpoint ด้วย Axios
      const response = await axios.post(`${API_URL}/api/setting/postFormSetting`, data); // แทน '/api/settings' ด้วย endpoint จริงของคุณ
      console.log('บันทึกข้อมูลสำเร็จ:', response.data);
      setSubmitSuccess(true);
      setAlertSuccess(<div>อัปโหลดสำเร็จ</div>)
 
      reset(); // ล้างข้อมูลในฟอร์มหลังจากส่งสำเร็จ
      fetchWebsiteInfo();
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
      setSubmitError(error);
      setSubmitSuccess(false);
      // คุณอาจต้องการแสดงข้อความผิดพลาดให้ผู้ใช้เห็นที่นี่
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        ข้อมูลเว็บไซต์
      </Typography>

      {submitSuccess === true && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>บันทึกข้อมูลสำเร็จ!</Alert>
      )}
      {submitSuccess === false && submitError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          เกิดข้อผิดพลาดในการบันทึกข้อมูล: {submitError.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* ชื่อเว็บไซต์ */}
          <Grid item xs={12}>
            <Controller
              name="websiteName"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>ชื่อเว็บไซต์</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.websiteName}
                    helperText={errors.websiteName?.message}
                  />
                </>
              )}
            />
          </Grid>

          {/* รายละเอียดเว็บไซต์ */}
          <Grid item xs={12}>
            <Controller
              name="websiteDescription"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>รายละเอียดเว็บไซต์</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.websiteDescription}
                    helperText={errors.websiteDescription?.message}
                  />
                </>
              )}
            />
          </Grid>

          {/* เบอร์โทรศัพท์ */}
          <Grid item xs={12}>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"
                }
              }}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>เบอร์โทรศัพท์</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                </>
              )}
            />
          </Grid>

          {/* อีเมล */}
          <Grid item xs={12}>
            <Controller
              name="eMail"
              control={control}
              rules={{
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "กรุณากรอกอีเมลให้ถูกต้อง" }
              }}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>อีเมล</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    margin="dense"
                    error={!!errors.eMail}
                    helperText={errors.eMail?.message}
                  />
                </>
              )}
            />
          </Grid>

          {/* Line ID */}
          <Grid item xs={12}>
            <Controller
              name="lineId"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>Line ID</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                  />
                </>
              )}
            />
          </Grid>

          {/* Facebook */}
          <Grid item xs={12}>
            <Controller
              name="facebookAccount"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>Facebook</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                  />
                </>
              )}
            />
          </Grid>

          {/* Instagram */}
          <Grid item xs={12}>
            <Controller
              name="instagramAccount"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>Instagram</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                  />
                </>
              )}
            />
          </Grid>

          {/* X (Twitter) */}
          <Grid item xs={12}>
            <Controller
              name="xAccount"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>X (Twitter)</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                  />
                </>
              )}
            />
          </Grid>

          {/* ที่อยู่ */}
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel shrink={!!field.value}>ที่อยู่</InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </>
              )}
            />
          </Grid>

          {/* 🎨 Primary Color */}
          <Grid item xs={6}>
            <InputLabel shrink>สีธีมหลัก</InputLabel>
            <Controller
              name="primaryColor"
              control={control}
              render={({ field }) => (
                <input
                  type="color"
                  {...field}
                  style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
                />
              )}
            />
          </Grid>

          {/* 🎨 Secondary Color */}
          <Grid item xs={6}>
            <InputLabel shrink>สีธีมรอง</InputLabel>
            <Controller
              name="secondaryColor"
              control={control}
              render={({ field }) => (
                <input
                  type="color"
                  {...field}
                  style={{ width: "100%", height: "40px", border: "none", cursor: "pointer" }}
                />
              )}
            />
          </Grid>

          {/* ปุ่มส่งข้อมูล */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "กำลังบันทึก..." : "ส่งข้อมูล"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <SuccessAlert successalert={alertSuccess} />
    </Box>
  );
};

export default WebsiteInfoForm;