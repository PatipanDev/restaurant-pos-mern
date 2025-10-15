const API_URL = import.meta.env.VITE_API_URL;


import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
// import axios from 'axios';
import { Fab} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import WarningAlert from "../../components/AlertDivWarn";
import SuccessAlert from '../../components/AlertSuccess';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';
import { getUserId } from '../../utils/userUtils';
const user_id = getUserId();


interface IFormInput {
  customer_Name: string;
  customer_Email: string;
  customer_Telnum: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [alertMessage, _] = useState<React.ReactNode | null>(null);
  const [succesMessage, setSuccAlertMessage] = useState<React.ReactNode | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const { control, handleSubmit, setValue } = useForm<IFormInput>({
    defaultValues: {
      customer_Name: '',
      customer_Email: '',
      customer_Telnum: '',
    },
  });

  useEffect(() => {
    // เช็คว่าเรามีข้อมูลใน localStorage หรือยัง
    const storedCustomer = localStorage.getItem('customer');

    if (storedCustomer) {
      // หากมีข้อมูลใน localStorage ให้ใช้ข้อมูลนั้น
      const customer = JSON.parse(storedCustomer);
      console.log('ใช้ข้อมูลจาก localStorage:', customer);

      setValue('customer_Name', customer.customer_Name);
      setValue('customer_Email', customer.customer_Email);
      setValue('customer_Telnum', customer.customer_Telnum);
    } else {
      // หากไม่มีข้อมูลใน localStorage ให้ดึงข้อมูลจาก API
      axios
        .get(`${API_URL}/api/auth/getAccoutCustomer/${user_id}`)
        .then((response) => {
          const customer = response.data.customer;
          console.log('ข้อมูลจาก API:', customer);

          // เก็บข้อมูลลง localStorage
          localStorage.setItem('customer', JSON.stringify(customer));

          // ตั้งค่าฟอร์มด้วยข้อมูลที่ได้รับจาก API
          setValue('customer_Name', customer.customer_Name);
          setValue('customer_Email', customer.customer_Email);
          setValue('customer_Telnum', customer.customer_Telnum);
        })
        .catch((error) => console.error('ไม่สามารถโหลดข้อมูลได้:', error));
    }
  }, [user_id, setValue]);

  const onSubmit = (data: IFormInput) => {
    const isConfirmed = window.confirm("คุณต้องการอัพเดตข้อมูลใช่หรือไม่");
    if (!isConfirmed) {
      return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
    }
    // ส่งข้อมูลที่แก้ไขไปที่ backend
    axios
      .put(`${API_URL}/api/auth/updateAccoutCustomeer/${user_id}`, data)
      .then((response) => {
        alert('ข้อมูลอัปเดตสำเร็จ!');
        console.log(response.data)
        const customer = response.data.customer;
          console.log('ข้อมูลจาก API:', customer);
          // เก็บข้อมูลลง localStorage
          localStorage.setItem('customer', JSON.stringify(customer));
      })
      .catch((error) => {
        console.error('ไม่สามารถอัปเดตข้อมูลได้:', error);
        alert('การอัปเดตข้อมูลล้มเหลว');
      });
  };

  // ฟังก์ชันล็อกเอาท์
  const handleLogout = () => {
    handleClickOpen(); // เปิด Dialog แจ้งเตือน
    // ลบข้อมูลการล็อกอินจาก localStorage
  };

  // เปิด Dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // ปิด Dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
      localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้
      setSuccAlertMessage(<div>ล็อกเอาท์ออกจากระบบเรียบร้อย</div>);
      setOpenDialog(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error("Logout failed", error);
    }

  };

  return (
    <React.Fragment>
      <h2>โปรไฟล์ลูกค้า</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="customer_Name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="ชื่อ" fullWidth variant="outlined" required />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="customer_Email"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="อีเมล" fullWidth variant="outlined" required />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="customer_Telnum"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="เบอร์โทรศัพท์" fullWidth variant="outlined" required />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              อัปเดตข้อมูล
            </Button>
          </Grid>
        </Grid>
      </form>
      <Box
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 45,
          zIndex: 1000,
        }}
      >
        <Fab color="primary" aria-label="logout" onClick={handleLogout}>
          <LogoutIcon />
        </Fab>
      </Box>

      {/* Dialog for Logout Confirmation */}
      <Dialog
        open={openDialog}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>คุณต้องการออกจากระบบใช่หรือไม่</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleConfirm}>ใช่</Button>
        </DialogActions>
      </Dialog>

      {/* Warning Alert */}
      <WarningAlert messagealert={alertMessage} />
      <SuccessAlert successalert={succesMessage} />
    </React.Fragment>
  );
}
