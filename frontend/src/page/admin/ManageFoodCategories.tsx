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

interface FoodCategory {
  _id: string;
  category_name: string;
  description?: string; // เพิ่ม description
}

interface FormData {
  category_name: string;
  description?: string; // เพิ่ม description
}

const schema = yup.object({
  category_name: yup.string().required('กรุณาใส่ชื่อหมวดหมู่สินค้า').max(100, 'ชื่อหมวดหมู่สินค้าต้องไม่เกิน 100 ตัวอักษร'),
  description: yup.string(), // เพิ่ม description
}).required();

const ManageFoodCategories: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<FoodCategory>>([]);
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
        const response = await axios.get('http://localhost:3000/api/data/getfoodcategory');
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
      const selectedRow = rows.find((row) => row._id === selectedRowId) as FoodCategory;
      if (selectedRow) {
        setValue('category_name', selectedRow.category_name);
        setValue('description', selectedRow.description || ''); // เพิ่ม description
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<FoodCategory>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'category_name', headerName: 'ชื่อหมวดหมู่อาหาร', flex: 1, minWidth: 180 },
    { field: 'description', headerName: 'คำอธิบาย', flex: 1, minWidth: 180 }, // เพิ่ม column description
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
        const categoryId = rows.find((row) => row._id === id)?._id;
        if (categoryId) {
          await axios.delete(`http://localhost:3000/api/data/deletefoodcategory/${categoryId}`);
          const updatedRows = rows.filter((row) => row._id !== categoryId);
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
        // อัปเดตข้อมูลที่มีอยู่
        await axios
          .put(`http://localhost:3000/api/data/updatefoodcategory/${selectedRowId}`, data) // ส่ง data ทั้งหมด
          .then((response) => {
            console.log("Update successful", response.data);
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);
  
            const updatedRows = rows.map((row) =>
              row._id === selectedRowId ? { ...row, ...data } : row // อัปเดต row ด้วย data ทั้งหมด
            );
            setRows(updatedRows);
          })
          .catch((error) => {
            console.error("Error updating data:", error);
            setAlertMessage(<div>เกิดข้อผิดพลาดในการอัปเดตข้อมูล</div>);
          });
      } else {
        // สร้างข้อมูลใหม่
        const response = await axios.post(
          "http://localhost:3000/api/data/createfoodcategory",
          data // ส่ง data ทั้งหมด
        );
        setRows([...rows, response.data]);
        setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      setAlertMessage(<div>เกิดข้อผิดพลาดในการดำเนินการ</div>);
    }
  };
  
  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <Dialog key={selectedRowId || "new"} open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขประเภทสินค้า' : 'เพิ่มประเภทสินค้า'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="category_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อประเภทอาหาร"
                  fullWidth
                  margin="dense"
                  error={!!errors.category_name}
                  helperText={errors.category_name?.message}
                  value={field.value || ""}
                />
              )}
            />
            <Controller // เพิ่ม Controller สำหรับ description
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="คำอธิบาย"
                  fullWidth
                  margin="dense"
                  multiline // ทำให้เป็น text area
                  rows={4} // กำหนดจำนวนแถว
                  value={field.value || ""}
                />
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
        <Button variant="contained" onClick={handleAddClick}>เพิ่มประเภทสินค้า</Button>
        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess} />
      </div>
    </div>
  );
}


export default ManageFoodCategories;  