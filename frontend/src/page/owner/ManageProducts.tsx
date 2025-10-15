const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,  MenuItem} from '@mui/material';
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
  product_Stock: number;
  product_Price: number;
  unitId: any; // Reference to Unit Model
  categoryId: any; // Reference to ProductCategory Model
}

interface FormData {
  product_Name: string;
  product_Quantity: number;
  product_Stock: number;
  product_Price: number;
  unitId: string;
  categoryId: string;
}

const schema = yup.object({
  product_Name: yup.string().required('กรุณาใส่ชื่อสินค้า').max(255, 'ชื่อต้องไม่เกิน 255 ตัวอักษร'),
  product_Quantity: yup.number().required('กรุณาใส่ปริมาณสินค้า').min(0, 'ปริมาณสินค้าไม่สามารถน้อยกว่า 0 ได้'),
  product_Stock: yup.number().required('กรุณาใส่ปริมาณคงเหลือ').min(0, 'ปริมาณคงเหลือไม่สามารถน้อยกว่า 0 ได้'),
  product_Price: yup.number().required('กรุณาใส่ราคา').min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  unitId: yup.string().required('กรุณาเลือกหน่วยสินค้า'),
  categoryId: yup.string().required('กรุณาเลือกประเภทสินค้า'),
}).required();



const ManageProducts: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Product>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const [units, setUnits] = useState<any[]>([]); // To store units

  const [categories, setCategories] = useState<any[]>([]); // To store categories

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/data/getproducts`);
      setRows(response.data.products);

      setUnits(response.data.unit);
      setCategories(response.data.category);

      console.log('Products:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId);
      if (selectedRow) { // Check if selectedRow has value
        setValue('product_Name', selectedRow.product_Name);
        setValue('product_Quantity', selectedRow.product_Quantity);
        setValue('product_Stock', selectedRow.product_Stock);
        setValue('product_Price', selectedRow.product_Price);
        setValue('categoryId', selectedRow.categoryId._id);
        setValue('unitId', selectedRow.unitId._id);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      align: 'right',
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'product_Name', headerName: 'ชื่อสินค้า', flex: 1, minWidth: 180, align: 'right' },
    { field: 'product_Quantity', headerName: 'ปริมาณที่ใช้ไปแล้ว', flex: 1, minWidth: 140, align: 'right' },
    { field: 'product_Stock', headerName: 'ปริมาณสินค้าคงเหลือ', flex: 1, minWidth: 150, align: 'right' },
    { 
      field: 'product_Price', 
      headerName: 'ราคาสินค้า(บาท)', 
      flex: 1, 
      minWidth: 120, 
      align: 'right',
      renderCell: (params) => params.row.product_Price?.toLocaleString(), 
    },
    {
      field: 'categoryId',
      headerName: 'หมวดหมู่สินค้า',
      flex: 1,
      minWidth: 150,
      align: 'right',
      renderCell: (params) => params.row.categoryId?.category_name,
    },
    {
      field: 'unitId',
      headerName: 'หน่วยสินค้า',
      flex: 1,
      minWidth: 150,
      align: 'right',
      renderCell: (params) => params.row.unitId?.unit_Name,
    },
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100,
      renderCell: (params) => {
        const isDisabled = !params.row.categoryId?.category_name || !params.row.unitId?.unit_Name;
    
        return (
          <Button
            variant="outlined"
            startIcon={<ModeEditIcon />}
            onClick={() => handleEditClick(params.id)}
            disabled={isDisabled} // ปิดการใช้งานถ้าค่าหนึ่งใดว่าง
          >
            แก้ไข
          </Button>
        );
      },
    },
    {
      field: 'delete',
      headerName: 'ลบข้อมูล',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteClick(params.id)}>
          ลบ
        </Button>
      ),
    },
  ];





  const handleDeleteClick = async (id: GridRowId) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้? เพราะข้อมูลการเตรียมวัตถุดิบจะถูกลบไปด้วย');
    if (confirmDelete) {
      try {
        const productId = rows.find((row) => row._id === id)?._id;
        if (productId) {
          // Call the delete API with the productId
          await axios.delete(`${API_URL}/api/data/deleteproduct/${productId}`);

          // Filter out the deleted row from the state
          const updatedRows = rows.filter((row) => row._id !== productId);
          setRows(updatedRows);

          setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
        } else {
          alert('ไม่พบข้อมูลที่จะลบ');
        }
      } catch (error: any) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        setAlertMessage(<div>{error.response.data.messege}</div>);
      }
    } else {
      // User cancelled deletion
    }
  };

  const handleEditClick = (id: GridRowId) => {
    // Set the selected row and open the dialog for editing
    setSelectedRowId(id);
    setOpen(true);
  };

  const handleAddClick = () => {
    // Reset and open the dialog for adding a new product
    setSelectedRowId(null);
    reset(); // Reset the form values
    setOpen(true);
  };

  const handleClose = () => {
    // Close the dialog and reset form
    setOpen(false);
    reset();
  };

  // On form submission, either create a new product or update an existing one
  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      if (selectedRowId !== null) {
        // Update an existing product
        const updatedData = {
          product_Name: data.product_Name,
          product_Quantity: data.product_Quantity,
          product_Stock: data.product_Stock,
          product_Price: data.product_Price,
          categoryId: data.categoryId,
          unitId: data.unitId,
        };

        console.log(updatedData)

        // Correct the URL and data
        await axios
          .put(`${API_URL}/api/data/updateproduct/${selectedRowId}`, updatedData) // Fixed URL format
          .then((response) => {
            console.log("Update successful", response.data);
            fetchData();
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);

            // // Update the rows in the state with the new data
            // const updatedRows = rows.map((row) =>
            //   row._id === selectedRowId ? { ...row, ...updatedData } : row
            // );
            // setRows(updatedRows);
          })
          .catch((error: any) => {
            console.error("Error updating data:", error);
            setAlertMessage(<div>{error.response.data.message}</div>);
          });
      } else {
       
        fetchData();
        // setRows([...rows, response.data]);
        setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
      }
      handleClose(); // Close the form dialog
    } catch (error) {
      console.error("Error submitting data:", error);
      setAlertMessage(<div>เกิดข้อผิดพลาดในการดำเนินการ</div>);
    }
  };

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มข้อมูลสินค้า'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="product_Name"
              control={control}
              rules={{ required: "กรุณากรอกชื่อสินค้า" }}
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
              rules={{ required: "กรุณากรอกปริมาณวัตถุดิบที่เตรียม" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ปริมาณที่ใช้ไปแล้ว"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Quantity}
                  helperText={errors.product_Quantity?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value || 0}
                // disabled={true} //ปิดการกรอกข้อมูล
                />
              )}
            />


            <Controller
              name="product_Stock"
              control={control}
              rules={{ required: "กรุณากรอกจำนวนสินค้าคงเหลือ" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="จำนวนสินค้าคงเหลือ"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Stock}
                  helperText={errors.product_Stock?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                  value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
                />
              )}
            />

            <Controller
              name="product_Price"
              control={control}
              rules={{ required: "กรุณากรอกราคา" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ราคาสินค้า"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Price}
                  helperText={errors.product_Price?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                  value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "กรุณาเลือกประเภท" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="ประเภท"
                  fullWidth
                  margin="dense"
                  error={!!errors.categoryId}
                  helperText={errors.categoryId?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.category_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      กรุณาเพิ่มข้อมูล ประเภทสินค้าก่อน ก่อน
                    </MenuItem>
                  )}
                </TextField>
              )}
            />

            <Controller
              name="unitId"
              control={control}
              rules={{ required: "กรุณาเลือกหน่วย" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="หน่วย"
                  fullWidth
                  margin="dense"
                  error={!!errors.unitId}
                  helperText={errors.unitId?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {Array.isArray(units) && units.length > 0 ? (
                    units.map((unit) => (
                      <MenuItem key={unit._id} value={unit._id}>
                        {unit.unit_Name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      กรุณาเพิ่มข้อมูล หน่วย ก่อน
                    </MenuItem>
                  )}
                </TextField>
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error">ยกเลิก</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)} color="success">
            {selectedRowId ? 'อัปเดต' : 'เพิ่ม'}
          </Button>
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

export default ManageProducts;  