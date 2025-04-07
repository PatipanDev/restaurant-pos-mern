const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';



interface Drink {
  _id: string;
  drink_Name: string;
  drink_Price: number;
  drink_Quantity: number;
  drink_Stock_quantity: number;
  drink_Manufacture_date: string;
  drink_Expiry_date: string;
  drink_Image: string;
}

interface FormData {
  drink_Name: string;
  drink_Price: number;
  drink_Quantity: number;
  drink_Stock_quantity: number;
  drink_Manufacture_date: string;
  drink_Expiry_date: string;
  drink_Image: File
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const schema = yup.object({
  drink_Name: yup.string().required('กรุณาใส่ชื่อเครื่องดื่ม').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  drink_Price: yup.number().required('กรุณาใส่ราคา').min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  drink_Quantity: yup.number().required('กรุณาใส่ปริมาณ').min(1, 'ปริมาณต้องมากกว่า 0'),
  drink_Stock_quantity: yup.number().required('กรุณาใส่ปริมาณคงเหลือ').min(0, 'ปริมาณคงเหลือต้องไม่ต่ำกว่า 0'),
  drink_Manufacture_date: yup.string().required('กรุณาใส่วันที่ผลิต'),
  drink_Expiry_date: yup.string().required('กรุณาใส่วันหมดอายุ'),
  drink_Image: yup
    .mixed<File>()
    .nullable()
    .default(null)
    .required('กรุณาเลือกรูปภาพ')
    .test('fileSize', 'ไฟล์ต้องมีขนาดไม่เกิน 2MB', (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    })
    .test('fileFormat', 'ไฟล์ต้องเป็น JPG, PNG หรือ WEBP', (value) => {
      return value && SUPPORTED_FORMATS.includes(value.type);
    }),
}).required();

const ManageDrinks: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Drink>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null); //เพิ่มที่เก็บรูปภาพ


  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
      const drinksResponse = await axios.get(`${API_URL}/api/food/getDrinks`); // Endpoint สำหรับดึงข้อมูลเครื่องดื่ม
      setRows(drinksResponse.data);
      console.log('Drinks:', drinksResponse.data);
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
      if (selectedRow) {
        setValue('drink_Name', selectedRow.drink_Name);
        setValue('drink_Price', selectedRow.drink_Price);
        setValue('drink_Quantity', selectedRow.drink_Quantity);
        setValue('drink_Stock_quantity', selectedRow.drink_Stock_quantity);
        const rawDate = new Date(selectedRow.drink_Manufacture_date);
        const formattedDate: any = rawDate.toISOString().split('T')[0]; // ได้รูปแบบ "2025-03-20"

        setValue('drink_Manufacture_date', formattedDate);
        // setValue('drink_Manufacture_date', selectedRow.drink_Manufacture_date);
        const rawDateEx = new Date(selectedRow.drink_Expiry_date);
        const formattedDateEx: any = rawDate.toISOString().split('T')[0]; // ได้รูปแบบ "2025-03-20"

        setValue('drink_Expiry_date', formattedDateEx);
        setSelectedImage(selectedRow.drink_Image || null);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    {
      field: 'drink_Image',
      headerName: 'รูปภาพ',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <img
          src={`${API_URL}/imagesdrink/${params.row.drink_Image}`} // ดึงภาพจาก URL
          alt={params.row.drink_Name}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    { field: 'drink_Name', headerName: 'ชื่อเครื่องดื่ม', flex: 1, minWidth: 180 },
    { field: 'drink_Price', headerName: 'ราคา', flex: 1, minWidth: 120 },
    { field: 'drink_Quantity', headerName: 'ปริมาณ', flex: 1, minWidth: 100 },
    { field: 'drink_Stock_quantity', headerName: 'จำนวนคงเหลือ', flex: 1, minWidth: 150 },
    {
      field: 'drink_Manufacture_date',
      headerName: 'วันที่ผลิต',
      flex: 1, minWidth: 150,
      renderCell: (params) => {
        const rawDate = params.row.drink_Manufacture_date;
        const date = new Date(rawDate);

        return date.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    { field: 'drink_Expiry_date', headerName: 'วันหมดอายุ', flex: 1, minWidth: 150 ,
        renderCell: (params) => {
          const rawDate = params.row.drink_Expiry_date;
          const date = new Date(rawDate);

          return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        },
    },
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditClick(params.id)}>
          แก้ไข
        </Button>
      ),
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
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
    if (confirmDelete) {
      try {
        const drinkId = rows.find((row) => row._id === id)?._id;
        if (drinkId) {
          // Call the delete API with the drinkId
          await axios.delete(`${API_URL}/api/food/deleteDrink/${drinkId}`); // ใช้ endpoint ที่ถูกต้อง

          // Filter out the deleted row from the state
          const updatedRows = rows.filter((row) => row._id !== drinkId);
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
      // User cancelled deletion
    }
  };

  const handleEditClick = (id: GridRowId) => {
    // Set the selected row and open the dialog for editing
    setSelectedRowId(id);
    setOpen(true);
  };

  const handleAddClick = () => {
    // Reset and open the dialog for adding a new drink
    setSelectedRowId(null);
    reset(); // Reset the form values
    setOpen(true);
  };

  const handleClose = () => {
    // Close the dialog and reset form
    setOpen(false);
    reset();
  };

  // On form submission, either create a new drink or update an existing one
  const onSubmit = async (data: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user._id || !user.role) {
      setAlertMessage(<div>ไม่พบข้อมูลผู้ใช้หรือผู้ใช้ไม่ได้ล็อกอิน</div>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("drink_Name", data.drink_Name);
      formData.append("drink_Price", data.drink_Price);
      formData.append("drink_Quantity", data.drink_Quantity);
      formData.append("drink_Stock_quantity", data.drink_Stock_quantity);
      formData.append("drink_Manufacture_date", data.drink_Manufacture_date);
      formData.append("drink_Expiry_date", data.drink_Expiry_date);
      if (data.drink_Image) {
        formData.append("drink_Image", data.drink_Image);
      }

      // ไม่ต้องเพิ่ม owner_Id และ chef_Id เนื่องจากไม่มีใน drinkSchema

      console.log(formData);

      let response;
      if (selectedRowId) {
        // อัปเดตข้อมูล (PUT)
        response = await axios.put(`${API_URL}/api/food/updateDrink/${selectedRowId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // เพิ่มข้อมูลใหม่ (POST)
        response = await axios.post(`${API_URL}/api/food/createDrink`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("Response:", response.data);
      setAlertSuccess(<div>เพิ่มข้อมูลเครื่องดื่มสำเร็จ</div>);
      handleClose(); // ปิด Dialog
      fetchData();
    } catch (error: any) {
      console.error("Error:", error);
      setAlertMessage(<div>{error.response.data.message || "เกิดข้อผิดพลาด"}</div>);
    }
  };


  return (
    <div style={{ height: '90vh', width: '80vw' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลเครื่องดื่ม' : 'เพิ่มข้อมูลเครื่องดื่ม'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="drink_Name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อเครื่องดื่ม"
                  fullWidth
                  margin="dense"
                  error={!!errors.drink_Name}
                  helperText={errors.drink_Name?.message}
                />
              )}
            />
            <Controller
              name="drink_Quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ปริมาณ"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.drink_Quantity}
                  helperText={errors.drink_Quantity?.message}
                />
              )}
            />
            <Controller
              name="drink_Stock_quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="จำนวนคงเหลือ"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.drink_Stock_quantity}
                  helperText={errors.drink_Stock_quantity?.message}
                />
              )}
            />
            <Controller
              name="drink_Price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ราคา"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.drink_Price}
                  helperText={errors.drink_Price?.message}
                />
              )}
            />
            <Controller
              name="drink_Manufacture_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="วันที่ผลิต"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                  error={!!errors.drink_Manufacture_date}
                  helperText={errors.drink_Manufacture_date?.message}
                />
              )}
            />
            <Controller
              name="drink_Expiry_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="วันหมดอายุ"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                  error={!!errors.drink_Expiry_date}
                  helperText={errors.drink_Expiry_date?.message}
                />
              )}
            />
            <Controller
              name="drink_Image"
              control={control}
              rules={{ required: "กรุณาเลือกรูปภาพ" }}
              render={({ field }) => (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-button"
                    style={{ display: "none" }} // ซ่อน input file
                    onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="upload-button">
                    <Button variant="contained" component="span" color="primary">
                      เลือกรูปภาพ
                    </Button>
                  </label>
                  {field.value && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {field.value.name}
                    </Typography>
                  )}
                  {errors.drink_Image && (
                    <Typography color="error" variant="body2">
                      {errors.drink_Image.message}
                    </Typography>
                  )}
                </div>
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

export default ManageDrinks;