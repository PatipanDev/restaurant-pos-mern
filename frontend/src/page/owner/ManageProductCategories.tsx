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

interface ProductCategory {
  _id: string;
  category_name: string;
}

interface FormData {
  category_name: string;
}

const schema = yup.object({
  category_name: yup.string().required('กรุณาใส่ชื่อหมวดหมู่สินค้า').max(100, 'ชื่อหมวดหมู่สินค้าต้องไม่เกิน 100 ตัวอักษร'),
}).required();

const ManageProductCategories: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<ProductCategory>>([]);
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
        const response = await axios.get(`${API_URL}/api/data/getcategories`); // เปลี่ยน URL
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
      const selectedRow = rows.find((row) => row._id === selectedRowId) as ProductCategory;
      if (selectedRow) {
        setValue('category_name', selectedRow.category_name);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<ProductCategory>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'category_name', headerName: 'ชื่อหมวดหมู่สินค้า', flex: 1, minWidth: 180 },
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
          await axios.delete(`${API_URL}/api/data/deletecategory/${categoryId}`); // เปลี่ยน URL

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
        const updatedData = {
          category_name: data.category_name,
        };

        await axios
          .put(`${API_URL}/api/data/updatecategory/${selectedRowId}`, updatedData) // เปลี่ยน URL
          .then((response) => {
            console.log("Update successful", response.data);
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);

            const updatedRows = rows.map((row) =>
              row._id === selectedRowId ? { ...row, ...updatedData } : row
            );
            setRows(updatedRows);
          })
          .catch((error) => {
            console.error("Error updating data:", error);
            setAlertMessage(<div>เกิดข้อผิดพลาดในการอัปเดตข้อมูล</div>);
          });
      } else {
        const response = await axios.post(
          `${API_URL}/api/data/createcategory`, // เปลี่ยน URL
          data
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
                  label="ชื่อประเภทสินค้า"
                  fullWidth
                  margin="dense"
                  error={!!errors.category_name}
                  helperText={errors.category_name?.message}
                  value={field.value || ""} // ป้องกัน undefined
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
};

export default ManageProductCategories;
