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

interface Chef {
  _id: string;
  chef_Name: string;
  chef_Password: string;
  chef_Details: string;
  chef_Weight: number;
  chef_Height: number;
  chef_Birthday: Date;
}

interface FormData {
  chef_Name: string;
  chef_Password: string;
  chef_Details: string;
  chef_Weight: number;
  chef_Height: number;
  chef_Birthday: Date;
}

const schema = yup.object({
  chef_Name: yup.string().required('กรุณาใส่ชื่อ').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  chef_Password: yup.string().required('กรุณาใส่รหัสผ่าน').min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').max(255, 'รหัสผ่านต้องไม่เกิน 255 ตัวอักษร'),
  chef_Details: yup.string().required('กรุณาใส่รายละเอียด'),
  chef_Weight: yup.number().required('กรุณาใส่น้ำหนัก').min(20, 'น้ำหนักต้องมากกว่า 20').max(300, 'น้ำหนักต้องน้อยกว่า 300'),
  chef_Height: yup.number().required('กรุณาใส่ส่วนสูง').min(120, 'ส่วนสูงต้องมากกว่า 120').max(250, 'ส่วนสูงต้องน้อยกว่า 250'),
  chef_Birthday: yup.date().required('กรุณาใส่วันเกิด'),
}).required();

const ManageChefs: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Chef>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/getChefs'); // เปลี่ยน endpoint เป็น /api/chefs
        setRows(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId) as Chef;
      if (selectedRow) {
        setValue('chef_Name', selectedRow.chef_Name);
        setValue('chef_Password', selectedRow.chef_Password);
        setValue('chef_Details', selectedRow.chef_Details);
        setValue('chef_Weight', selectedRow.chef_Weight);
        setValue('chef_Height', selectedRow.chef_Height);
        setValue('chef_Birthday', selectedRow.chef_Birthday);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Chef>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'chef_Name', headerName: 'ชื่อ', flex: 1, minWidth: 180 },
    { field: 'chef_Password', headerName: 'รหัสผ่าน', flex: 2, minWidth: 200 },
    { field: 'chef_Details', headerName: 'รายละเอียด', flex: 2, minWidth: 200 },
    { field: 'chef_Weight', headerName: 'น้ำหนัก', flex: 1, minWidth: 100 },
    { field: 'chef_Height', headerName: 'ส่วนสูง', flex: 1, minWidth: 100 },
    { field: 'chef_Birthday', headerName: 'วันเกิด', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100,
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
        const chefId = rows.find((row) => row._id === id)?._id;
        if (chefId) {
          await axios.delete(`http://localhost:3000/api/auth/deleteChef/${chefId}`);
          const updatedRows = rows.filter((row) => row._id !== chefId);
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

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
  
    try {
      if (selectedRowId !== null) {
        const updatedData = {
          chef_Name: data.chef_Name,
          chef_Password: data.chef_Password,
          chef_Weight: Number(data.chef_Weight),
          chef_Height: Number(data.chef_Height),
          chef_Details: data.chef_Details,
          chef_Birthday: data.chef_Birthday,
        };
  
        await axios
          .put(`http://localhost:3000/api/auth/updateChef/${selectedRowId}`, updatedData) // เปลี่ยน endpoint เป็น /api/chefs
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
          "http://localhost:3000/api/auth/registerChef", // เปลี่ยน endpoint เป็น /api/chefs
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
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลเชฟ' : 'เพิ่มข้อมูลเชฟ'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="chef_Name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="ชื่อ" fullWidth margin="dense" error={!!errors.chef_Name} helperText={errors.chef_Name?.message} />
              )}
            />
            <Controller
              name="chef_Password"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="password" label="รหัสผ่าน" fullWidth margin="dense" error={!!errors.chef_Password} helperText={errors.chef_Password?.message} />
              )}
            />
            <Controller
              name="chef_Details"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="รายละเอียด" fullWidth margin="dense" error={!!errors.chef_Details} helperText={errors.chef_Details?.message} />
              )}
            />
            <Controller
              name="chef_Weight"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="น้ำหนัก" fullWidth margin="dense" error={!!errors.chef_Weight} helperText={errors.chef_Weight?.message} />
              )}
            />
            <Controller
              name="chef_Height"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="ส่วนสูง" fullWidth margin="dense" error={!!errors.chef_Height} helperText={errors.chef_Height?.message} />
              )}
            />
            <Controller
              name="chef_Birthday"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" label="วันเกิด" fullWidth margin="dense" InputLabelProps={{ shrink: true }} error={!!errors.chef_Birthday} helperText={errors.chef_Birthday?.message} />
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
}

export default ManageChefs;