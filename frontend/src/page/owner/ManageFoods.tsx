const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId} from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, Typography, DialogContent, DialogTitle, TextField, MenuItem} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';

interface Food {
  _id: string;
  food_Name: string;
  food_Stock: number;
  food_Price: number;
  product_Category_Id: any; // Reference to ProductCategory Model
  chef_Id: string;
  owner_Id: string;
  food_Image: string; // เพิ่มฟิลด์ food_Image
}

interface FormData {
  food_Name: string;
  food_Stock: number;
  food_Price: number;
  product_Category_Id: string;
  food_Image: File; // เพิ่มฟิลด์ food_Image สำหรับไฟล์รูปภาพ
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const schema = yup.object({
  food_Name: yup
    .string()
    .required('กรุณาใส่ชื่ออาหาร')
    .max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),

  food_Stock: yup
    .number()
    .typeError('จำนวนคงเหลือต้องเป็นตัวเลข')
    .required('กรุณาใส่จำนวนคงเหลือ')
    .min(0, 'จำนวนคงเหลือไม่สามารถน้อยกว่า 0 ได้'),

  food_Price: yup
    .number()
    .typeError('ราคาต้องเป็นตัวเลข')
    .required('กรุณาใส่ราคา')
    .min(0, 'ราคาต้องไม่ต่ำกว่า 0'),

  product_Category_Id: yup
    .string()
    .required('กรุณาเลือกประเภทอาหาร'),

  food_Image: yup
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

const ManageFoods: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Food>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const [categories, setCategories] = useState<any[]>([]); // To store categories



  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
      const foodsResponse = await axios.get(`${API_URL}/api/food/getfoods`);
      setRows(foodsResponse.data);

      const categoriesResponse = await axios.get(`${API_URL}/api/data/getfoodcategory`);
      setCategories(categoriesResponse.data);


      console.log('Foods:', foodsResponse.data);
      console.log('Categories:', categoriesResponse.data);

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
        setValue('food_Name', selectedRow.food_Name);
        setValue('food_Stock', selectedRow.food_Stock);
        setValue('food_Price', selectedRow.food_Price);
        setValue('product_Category_Id', selectedRow.product_Category_Id._id);
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
      field: 'food_Image',
      headerName: 'รูปภาพ',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <img
          src={`${API_URL}/images/${params.row.food_Image}`} // ดึงภาพจาก URL
          alt={params.row.food_Name}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    { field: 'food_Name', headerName: 'ชื่ออาหาร', flex: 1, minWidth: 180 },
    { field: 'food_Stock', headerName: 'จำนวนคงเหลือ', flex: 1, minWidth: 100 },
    { field: 'food_Price', headerName: 'ราคาอาหาร', flex: 1, minWidth: 120 },
    {
      field: 'product_Category',
      headerName: 'ประเภทอาหาร',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.product_Category_Id?.category_name,
    },
    {
      field: 'chef_Id',
      headerName: 'เชฟ',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.chef_Id?.chef_Name,
    },
    {
      field: 'owner_Id',
      headerName: 'เจ้าของร้าน',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.owner_Id?.owner_Name,
    },
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100,
      renderCell: (params) => {
        const isDisabled = !params.row.product_Category_Id?.category_name
    
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
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
    if (confirmDelete) {
      try {
        const foodId = rows.find((row) => row._id === id)?._id;
        if (foodId) {
          await axios.delete(`${API_URL}/api/food/deleteFood/${foodId}`);
          const updatedRows = rows.filter((row) => row._id !== foodId);
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

  const onSubmit = async (data: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user._id || !user.role) {
      setAlertMessage(<div>ไม่พบข้อมูลผู้ใช้หรือผู้ใช้ไม่ได้ล็อกอิน</div>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("food_Name", data.food_Name);
      formData.append("food_Stock", data.food_Stock);
      formData.append("food_Price", data.food_Price);
      formData.append("product_Category_Id", data.product_Category_Id);
      if (data.food_Image) {
        formData.append("food_Image", data.food_Image);
      }

      if (user.role === "chef") {
        formData.append("owner_Id", "");
        formData.append("chef_Id", user._id);
      } else if (user.role === "owner") {
        formData.append("owner_Id", user._id);
        formData.append("chef_Id", "");
      }

      console.log(formData)
  
      let response;
      if (selectedRowId) {
        // อัปเดตข้อมูล (PUT)
        response = await axios.put(`${API_URL}/api/food/updateFood/${selectedRowId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // เพิ่มข้อมูลใหม่ (POST)
        response = await axios.post(`${API_URL}/api/food/createFood`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }


  
      console.log("Response:", response.data);
      setAlertSuccess(<div>เข้าเพิ่มข้อมูลรูปภาพสำเร็จ</div>)
      handleClose(); // ปิด Dialog
      fetchData()
    } catch (error: any) {
      console.error("Error:", error);
      setAlertMessage(<div>{error.response.message}</div>)
    }
  };

  return (
    <div style={{ height: '90vh', width: '80vw' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลอาหาร' : 'เพิ่มข้อมูลอาหาร'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="food_Name"
              control={control}
              rules={{ required: "กรุณากรอกชื่ออาหาร" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่ออาหาร"
                  fullWidth
                  margin="dense"
                  error={!!errors.food_Name}
                  helperText={errors.food_Name?.message}
                />
              )}
            />

            <Controller
              name="food_Stock"
              control={control}
              rules={{ required: "กรุณากรอกจำนวนคงเหลือ" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="จำนวนคงเหลือ"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.food_Stock}
                  helperText={errors.food_Stock?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                  value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
                />
              )}
            />

            <Controller
              name="food_Price"
              control={control}
              rules={{ required: "กรุณากรอกราคา" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ราคาอาหาร(บาท)"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.food_Price}
                  helperText={errors.food_Price?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                  value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
                />
              )}
            />

            <Controller
              name="product_Category_Id"
              control={control}
              rules={{ required: "กรุณาเลือกประเภทอาหาร" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="ประเภทอาหาร"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Category_Id}
                  helperText={errors.product_Category_Id?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="food_Image"
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
                  {errors.food_Image && (
                    <Typography color="error" variant="body2">
                      {errors.food_Image.message}
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

export default ManageFoods;  