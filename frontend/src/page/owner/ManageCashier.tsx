const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';


import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';

interface Cashier {
  _id: string;
  cashier_Name: string;
  cashier_Password: string;
  cashier_Address: string;
  cashier_Weight: number;
  cashier_Height: number;
  cashier_Gender: 'Male' | 'Female' | 'Other';
  cashier_Birthdate: Date;
}

interface FormData {
  cashier_Name: string;
  cashier_Password: string;
  cashier_Address: string;
  cashier_Weight: number;
  cashier_Height: number;
  cashier_Gender: 'Male' | 'Female' | 'Other';
  cashier_Birthdate: Date;
}

const schema = yup.object({
  cashier_Name: yup.string().required('กรุณาใส่ชื่อ').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  cashier_Password: yup.string().required('กรุณาใส่รหัสผ่าน').min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').max(255, 'รหัสผ่านต้องไม่เกิน 255 ตัวอักษร'),
  cashier_Address: yup.string().required('กรุณาใส่ที่อยู่'),
  cashier_Weight: yup.number().required('กรุณาใส่น้ำหนัก').min(20, 'น้ำหนักต้องมากกว่า 20').max(300, 'น้ำหนักต้องน้อยกว่า 300'),
  cashier_Height: yup.number().required('กรุณาใส่ส่วนสูง').min(120, 'ส่วนสูงต้องมากกว่า 120').max(250, 'ส่วนสูงต้องน้อยกว่า 250'),
  cashier_Gender: yup.string().oneOf(['Male', 'Female', 'Other'], 'กรุณาเลือกเพศ').required('กรุณาเลือกเพศ'),
  cashier_Birthdate: yup.date().required('กรุณาใส่วันเกิด'),
}).required();

const ManageCashier: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Cashier>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  //ส่วนของการแจ้งเตือน
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/getcashiers`);
        setRows(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRowId !== null) {
        const selectedRow = rows.find((row) => row._id === selectedRowId) as Cashier;
        if (selectedRow) { // เพิ่มการตรวจสอบว่า selectedRow มีค่าหรือไม่
            setValue('cashier_Name', selectedRow.cashier_Name);
            setValue('cashier_Password', selectedRow.cashier_Password);
            setValue('cashier_Address', selectedRow.cashier_Address);
            setValue('cashier_Weight', selectedRow.cashier_Weight);
            setValue('cashier_Height', selectedRow.cashier_Height);
            setValue('cashier_Gender', selectedRow.cashier_Gender);
            setValue('cashier_Birthdate', selectedRow.cashier_Birthdate);
        }
    }
}, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Cashier>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'cashier_Name', headerName: 'ชื่อ', flex: 1, minWidth: 180 },
    { field: 'cashier_Address', headerName: 'ที่อยู่', flex: 2, minWidth: 200 },
    { field: 'cashier_Weight', headerName: 'น้ำหนัก', flex: 1, minWidth: 100 },
    { field: 'cashier_Height', headerName: 'ส่วนสูง', flex: 1, minWidth: 100 },
    { field: 'cashier_Gender', headerName: 'เพศ', flex: 1, minWidth: 100 },
    { field: 'cashier_Birthdate', headerName: 'วันเกิด', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100, // คอลัมน์นี้ยังคงความกว้างคงที่
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditClick(params.id)}>แก้ไข</Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'ลบข้อมูล',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteClick(params.id)}>ลบ</Button>
      ),
    },
  ];

  const handleDeleteClick = async (id: GridRowId) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
    if (confirmDelete) {
      try {
        const cashierId = rows.find((row) => row._id === id)?._id;
        if (cashierId) {
          await axios.delete(`${API_URL}/api/auth/deletecashier/${cashierId}`);

          const updatedRows = rows.filter((row) => row._id !== cashierId);
          setRows(updatedRows);

          setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
        } else {
          alert('ไม่พบข้อมูลที่จะลบ');
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        setAlertMessage(<div>เกิดข้อผิดพลาดในการลบข้อมูล</div>);
      }
    } else {
      // ผู้ใช้ยกเลิกการลบ
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setSelectedRowId(id);
    setOpen(true);
  };

  const handleAddClick = () => {
    setSelectedRowId(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  

  // ... (ส่วนฟังก์ชันอื่นๆ)

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
  
    try {
      if (selectedRowId !== null) {
        const updatedData = {
          cashier_Name: data.cashier_Name,
          cashier_Password: data.cashier_Password, // อาจต้องเช็คว่ามีการเปลี่ยนรหัสผ่านหรือไม่
          cashier_Weight: Number(data.cashier_Weight),
          cashier_Height: Number(data.cashier_Height),
          cashier_Address: data.cashier_Address,
          cashier_Gender: data.cashier_Gender,
          cashier_Birthdate: data.cashier_Birthdate,
        };

        await axios
          .put(`${API_URL}/api/auth/updatecashier/${selectedRowId}`, updatedData)
          .then((response) => {
            console.log("Update successful", response.data);
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);

            // อัปเดตข้อมูลที่แสดงใน UI
            const updatedRows = rows.map((row) =>
              row._id === selectedRowId ? { ...row, ...updatedData } : row
            );
            setRows(updatedRows);
          })
          .catch((error) => {
            console.error("Error updating data:", error);
            setAlertMessage(<div>เกิดข้อผิดพลาดในการอัปเดตข้อมูล</div>); // เพิ่มการแสดงข้อผิดพลาด
          });
      } else {
        // เพิ่มข้อมูลใหม่
        const response = await axios.post(
          `${API_URL}/api/auth/registercashier`,
          data
        );
        setRows([...rows, response.data]);
        setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      setAlertMessage(<div>เกิดข้อผิดพลาดในการดำเนินการ</div>); // เพิ่มการแสดงข้อผิดพลาด
    }
  };

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลแคชเชียร์' : 'เพิ่มข้อมูลแคชเชียร์'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="cashier_Name"
              control={control}

              render={({ field }) => (
                <TextField {...field} label="ชื่อ" fullWidth margin="dense" error={!!errors.cashier_Name} helperText={errors.cashier_Name?.message} />
              )}
            />
            <Controller
              name="cashier_Password"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="password" label="รหัสผ่าน" fullWidth margin="dense" error={!!errors.cashier_Password} helperText={errors.cashier_Password?.message} />
              )}
            />
            <Controller
              name="cashier_Address"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="ที่อยู่" fullWidth margin="dense" error={!!errors.cashier_Address} helperText={errors.cashier_Address?.message} />
              )}
            />
            <Controller
              name="cashier_Weight"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="น้ำหนัก" fullWidth margin="dense" error={!!errors.cashier_Weight} helperText={errors.cashier_Weight?.message} />
              )}
            />
            <Controller
              name="cashier_Height"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="ส่วนสูง" fullWidth margin="dense" error={!!errors.cashier_Height} helperText={errors.cashier_Height?.message} />
              )}
            />
            <Controller
              name="cashier_Gender"
              control={control}
              // defaultValue="Other"
              render={({ field }) => (
                <TextField
                  select
                  // defaultValue="Other"
                  label="เพศ"
                  fullWidth
                  margin="dense"
                  error={!!errors.cashier_Gender}
                  helperText={errors.cashier_Gender?.message}
                  value={field.value || ''} // ✅ ป้องกัน undefined
                  onChange={field.onChange}
                >
                  <MenuItem value="Male">ชาย</MenuItem>
                  <MenuItem value="Female">หญิง</MenuItem>
                  <MenuItem value="Other">อื่น ๆ</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="cashier_Birthdate"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" label="วันเกิด" fullWidth margin="dense" InputLabelProps={{ shrink: true }} error={!!errors.cashier_Birthdate} helperText={errors.cashier_Birthdate?.message} />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error">ยกเลิก</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)} color="success">{selectedRowId ? 'อัปเดต' : 'เพิ่ม'}</Button>
        </DialogActions>
      </Dialog>
      <ErrorBoundary>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      </ErrorBoundary>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <Button variant="contained" onClick={handleAddClick}>เพิ่มข้อมูล</Button>
        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess} />
      </div>
    </div>
  );
};

export default ManageCashier;