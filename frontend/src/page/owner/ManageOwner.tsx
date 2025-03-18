const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';


interface ShopOwner {
  _id: string;
  owner_Name: string;
  owner_Password: string;
  owner_Details: string;
}

interface FormData {
  owner_Name: string;
  owner_Password: string;
  owner_Details: string;
}

const schema = yup.object({
  owner_Name: yup.string().required('กรุณาใส่ชื่อ').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  owner_Password: yup.string().required('กรุณาใส่รหัสผ่าน').min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').max(255, 'รหัสผ่านต้องไม่เกิน 255 ตัวอักษร'),
  owner_Details: yup.string().required('กรุณาใส่รายละเอียด'),
}).required();

const ManageShopOwners: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<ShopOwner>>([]);
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
        const response = await axios.get(`${API_URL}/api/auth/getShopowner`);
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
      const selectedRow = rows.find((row) => row._id === selectedRowId) as ShopOwner;
      console.log(selectedRow)
      if (selectedRow) {
        setValue('owner_Name', selectedRow.owner_Name);
        setValue('owner_Password', selectedRow.owner_Password);
        setValue('owner_Details', selectedRow.owner_Details);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<ShopOwner>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'owner_Name', headerName: 'ชื่อเจ้าของร้าน', flex: 1, minWidth: 180 },
    { field: 'owner_Password', headerName: 'รหัสผ่าน', flex: 2, minWidth: 200 },
    { field: 'owner_Details', headerName: 'รายละเอียด', flex: 2, minWidth: 200 },
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
        const ownerId = rows.find((row) => row._id === id)?._id;
        if (ownerId) {
          await axios.delete(`${API_URL}/api/auth/deleteShopowner/${ownerId}`);
          const updatedRows = rows.filter((row) => row._id !== ownerId);
          setRows(updatedRows);
          setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
        } else {
          alert('ไม่พบข้อมูลที่จะลบ');
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        setAlertMessage(<div>เกิดข้อผิดพลาดในการลบข้อมูล</div>);
      }
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
          owner_Name: data.owner_Name,
          owner_Password: data.owner_Password,
          owner_Details: data.owner_Details,
        };
  
        await axios
          .put(`${API_URL}/api/auth/updateShopowner/${selectedRowId}`, updatedData)
          .then((response) => {
            console.log("Update successful", response.data);
            setAlertSuccess(<div>{response.data.message}</div>);
  
            // อัปเดตข้อมูลที่แสดงใน UI
            const updatedRows = rows.map((row) =>
              row._id === selectedRowId ? { ...row, ...updatedData } : row
            );
            setRows(updatedRows);
          })
          .catch((error) => {
            console.error("Error updating data:", error);
            if (error.response) {
              setAlertMessage(<div>{error.response.data.message}</div>);
            } else if (error.request) {
              setAlertMessage(<div>Server ไม่ตอบสนอง โปรดลองใหม่</div>);
            } else {
              setAlertMessage(<div>{error.message}</div>);
            }
            // setAlertMessage(<div>เกิดข้อผิดพลาดในการอัปเดตข้อมูล</div>);
          });
      } else {
        // เพิ่มข้อมูลใหม่
        const response = await axios.post(
          `${API_URL}}/api/auth/addShopowner`, // เปลี่ยน endpoint เป็น /api/shopowners
          data
        );
        console.log(response)
        setAlertSuccess(<div>{response.data.message}</div>);

        setRows([...rows, response.data]);

      }
      handleClose();
    } catch (error: any) {
      console.error("Error submitting data:", error);
      if (error.response) {
        setAlertMessage(<div>{error.response.data.message}</div>);
      } else if (error.request) {
        setAlertMessage(<div>Server ไม่ตอบสนอง โปรดลองใหม่</div>);
      } else {
        setAlertMessage(<div>{error.message}</div>);
      }
      // setAlertMessage(<div>เกิดข้อผิดพลาดในการดำเนินการ</div>);
    }
  };
  
  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลเจ้าของร้าน' : 'เพิ่มข้อมูลเจ้าของร้าน'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
  name="owner_Name"
  control={control}
  defaultValue=""
  render={({ field }) => (
    <TextField {...field} label="ชื่อเจ้าของร้าน" fullWidth margin="dense" 
      error={!!errors.owner_Name} helperText={errors.owner_Name?.message} />
  )}
/>
            <Controller
              name="owner_Password"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="password" label="รหัสผ่าน" fullWidth margin="dense" error={!!errors.owner_Password} helperText={errors.owner_Password?.message} />
              )}
            />
            <Controller
              name="owner_Details"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="รายละเอียด" fullWidth margin="dense" error={!!errors.owner_Details} helperText={errors.owner_Details?.message} />
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

export default ManageShopOwners;