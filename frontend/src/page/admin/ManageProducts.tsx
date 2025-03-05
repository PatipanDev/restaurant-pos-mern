import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';

interface Product {
  _id: string;
  product_Name: string;
  product_Quantity: number;
  product_Ramquantity: number;
  product_Price: number;
  category_Id: string; // เปลี่ยนเป็น String เพื่อเก็บ ObjectId
}

interface ProductCategory {
  _id: string;
  category_name: string;
}

interface FormData {
  product_Name: string;
  product_Quantity: number;
  product_Ramquantity: number;
  product_Price: number;
  category_Id: string;
}

const schema = yup.object({
  product_Name: yup.string().required('กรุณาใส่ชื่อสินค้า').max(255, 'ชื่อสินค้าต้องไม่เกิน 255 ตัวอักษร'),
  product_Quantity: yup.number().required('กรุณาใส่ปริมาณสินค้า').min(0, 'ปริมาณสินค้าต้องไม่น้อยกว่า 0'),
  product_Ramquantity: yup.number().required('กรุณาใส่ปริมาณคงเหลือสินค้า').min(0, 'ปริมาณคงเหลือสินค้าต้องไม่น้อยกว่า 0'),
  product_Price: yup.number().required('กรุณาใส่ราคา').min(0, 'ราคาต้องไม่น้อยกว่า 0'),
  category_Id: yup.string().required('กรุณาเลือกประเภทสินค้า'),
}).required();

const ManageProducts: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Product>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]); // เพิ่ม state สำหรับเก็บ categories

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:3000/api/data/getcategories');
        setCategories(categoryResponse.data);

        const response = await axios.get('http://localhost:3000/api/data/getproducts');
        setRows(response.data);
        console.log(response.data);

        // ดึงข้อมูล categories มาเก็บไว้

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId) as Product;
      if (selectedRow) {
        setValue('product_Name', selectedRow.product_Name);
        setValue('product_Quantity', selectedRow.product_Quantity);
        setValue('product_Ramquantity', selectedRow.product_Ramquantity);
        setValue('product_Price', selectedRow.product_Price);
        setValue('category_Id', selectedRow.category_Id);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Product>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows && rows.length ? rows.indexOf(params.row) + 1 : '',
    },
    { field: 'product_Name', headerName: 'ชื่อสินค้า', flex: 1, minWidth: 180 },
    { field: 'product_Quantity', headerName: 'ปริมาณสินค้า', flex: 1, minWidth: 100 },
    { field: 'product_Ramquantity', headerName: 'ปริมาณคงเหลือสินค้า', flex: 1, minWidth: 100 },
    { field: 'product_Price', headerName: 'ราคา', flex: 1, minWidth: 100 },
    {
      field: 'category_Id',
      headerName: 'ประเภทสินค้า',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: GridCellParams) => {  // ระบุประเภทของ params
        const categoryId = params.row.category_Id;  // ใช้ params.row เพื่อเข้าถึง category_Id
        const category = categories?.find((cat) => cat._id === categoryId);
        return category?.category_name || '';
      },
    },
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
        const productId = rows.find((row) => row._id === id)?._id;
        if (productId) {
          await axios.delete(`http://localhost:3000/api/data/deleteproduct/${productId}`);

          const updatedRows = rows.filter((row) => row._id !== productId);
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
          product_Name: data.product_Name,
          product_Quantity: data.product_Quantity,
          product_Ramquantity: data.product_Ramquantity,
          product_Price: data.product_Price,
          category_Id: data.category_Id,
        };

        await axios
          .put(`http://localhost:3000/api/data/products/${selectedRowId}`, updatedData) // เปลี่ยน URL
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
          "http://localhost:3000/api/data/products", // เปลี่ยน URL
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลแคชเชียร์' : 'เพิ่มข้อมูลแคชเชียร์'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="product_Name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อสินค้า"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Name}
                  helperText={errors.product_Name?.message}
                />
              )}
            />
            <Controller
              name="product_Quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="จำนวนสินค้า"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Quantity}
                  helperText={errors.product_Quantity?.message}
                />
              )}
            />
            <Controller
              name="product_Ramquantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="หน่วยความจำสินค้า"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Ramquantity}
                  helperText={errors.product_Ramquantity?.message}
                />
              )}
            />
            <Controller
              name="product_Price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ราคาสินค้า"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Price}
                  helperText={errors.product_Price?.message}
                />
              )}
            />
            <Controller
              name="category_Id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="หมวดหมู่สินค้า"
                  select
                  fullWidth
                  margin="dense"
                  error={!!errors.category_Id}
                  helperText={errors.category_Id?.message}
                >
                  {/* Render category options dynamically */}
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </TextField>
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

export default ManageProducts;