import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ObjectId } from 'mongodb';

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
  product_Category: string; // Reference to ProductCategory Model
  chef_Id: string; // Reference to Chef Model
  owner_Id: string; // Reference to ShopOwner Model
}

interface FormData {
  food_Name: string;
  food_Stock: number;
  food_Price: number;
  product_Category: string;
  chef_Id: string;
  owner_Id: string;
}

const schema = yup.object({
  food_Name: yup.string().required('กรุณาใส่ชื่ออาหาร').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  food_Stock: yup.number().required('กรุณาใส่จำนวนคงเหลือ').min(0, 'จำนวนคงเหลือไม่สามารถน้อยกว่า 0 ได้'),
  food_Price: yup.number().required('กรุณาใส่ราคา').min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  product_Category: yup.string().required('กรุณาเลือกประเภทอาหาร'),
  chef_Id: yup.string().required('กรุณาเลือกเชฟ'),
  owner_Id: yup.string().required('กรุณาเลือกพนักงาน'),
}).required();

const ManageFoods: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Food>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const [categories, setCategories] = useState<any[]>([]); // To store categories
  const [chefs, setChefs] = useState<any[]>([]); // To store chefs
  const [owners, setOwners] = useState<any[]>([]); // To store owners

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodsResponse = await axios.get('http://localhost:3000/api/data/getfoods');
        setRows(foodsResponse.data);

        const categoriesResponse = await axios.get('http://localhost:3000/api/data/');
        setCategories(categoriesResponse.data);

        const chefsResponse = await axios.get('http://localhost:3000/api/chefs');
        setChefs(chefsResponse.data);

        const ownersResponse = await axios.get('http://localhost:3000/api/shopowners');
        setOwners(ownersResponse.data);

        console.log('Foods:', foodsResponse.data);
        console.log('Categories:', categoriesResponse.data);
        console.log('Chefs:', chefsResponse.data);
        console.log('Owners:', ownersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddFood = async (data: FormData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/data/addFood', data);
      setRows([...rows, response.data]);
      setAlertSuccess('Food added successfully!');
      setOpen(false);
    } catch (error) {
      setAlertMessage('Error adding food.');
      console.error(error);
    }
  };

  const handleDeleteFood = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/data/deletefoods/${id}`);
      setRows(rows.filter((row) => row._id !== id));
      setAlertSuccess('Food deleted successfully!');
    } catch (error) {
      setAlertMessage('Error deleting food.');
      console.error(error);
    }
  };

  const handleEditFood = (id: string) => {
    const food = rows.find((row) => row._id === id);
    if (food) {
      setValue('food_Name', food.food_Name);
      setValue('food_Stock', food.food_Stock);
      setValue('food_Price', food.food_Price);
      setValue('product_Category', food.product_Category);
      setValue('chef_Id', food.chef_Id);
      setValue('owner_Id', food.owner_Id);
      setSelectedRowId(id);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId);
      if (selectedRow) {
        setValue('food_Name', selectedRow.food_Name);
        setValue('food_Stock', selectedRow.food_Stock);
        setValue('food_Price', selectedRow.food_Price);
        setValue('product_Category', selectedRow.product_Category);
        setValue('chef_Id', selectedRow.chef_Id);
        setValue('owner_Id', selectedRow.owner_Id);
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
    { field: 'food_Name', headerName: 'ชื่ออาหาร', flex: 1, minWidth: 180 },
    { field: 'food_Stock', headerName: 'จำนวนคงเหลือ', flex: 1, minWidth: 100 },
    { field: 'food_Price', headerName: 'ราคาอาหาร', flex: 1, minWidth: 120 },
    {
      field: 'product_Category',
      headerName: 'ประเภทอาหาร',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => categories.find((cat) => cat._id === params.row.product_Category)?.category_name,
    },
    {
      field: 'chef_Id',
      headerName: 'เชฟ',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => chefs.find((chef) => chef._id === params.row.chef_Id)?.chef_Name,
    },
    {
      field: 'owner_Id',
      headerName: 'พนักงาน',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => owners.find((owner) => owner._id === params.row.owner_Id)?.owner_Name,
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
        const foodId = rows.find((row) => row._id === id)?._id;
        if (foodId) {
          await axios.delete(`http://localhost:3000/api/data/updatefoods/${foodId}`);
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
  
  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
  
    try {
      if (selectedRowId !== null) {
        const updatedData = {
          food_Name: data.food_Name,
          food_Stock: data.food_Stock,
          food_Price: data.food_Price,
          product_Category: data.product_Category,
          chef_Id: data.chef_Id,
          owner_Id: data.owner_Id,
        };
  
        await axios
          .put(`http://localhost:3000/api/foods/${selectedRowId}`, updatedData)
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
          "http://localhost:3000/api/foods",
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
                  label="ราคาอาหาร"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.food_Price}
                  helperText={errors.food_Price?.message}
                />
              )}
            />
  
            <Controller
              name="product_Category"
              control={control}
              rules={{ required: "กรุณาเลือกประเภทอาหาร" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="ประเภทอาหาร"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Category}
                  helperText={errors.product_Category?.message}
                  value={field.value || ""}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    field.onChange(selectedValue);
                  }}
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
              name="chef_Id"
              control={control}
              rules={{ required: "กรุณาเลือกเชฟ" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="เชฟ"
                  fullWidth
                  margin="dense"
                  error={!!errors.chef_Id}
                  helperText={errors.chef_Id?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {chefs.map((chef) => (
                    <MenuItem key={chef._id} value={chef._id}>
                      {chef.chef_Name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
  
            <Controller
              name="owner_Id"
              control={control}
              rules={{ required: "กรุณาเลือกพนักงาน" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="พนักงาน"
                  fullWidth
                  margin="dense"
                  error={!!errors.owner_Id}
                  helperText={errors.owner_Id?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {owners.map((owner) => (
                    <MenuItem key={owner._id} value={owner._id}>
                      {owner.owner_Name}
                    </MenuItem>
                  ))}
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

  export default ManageFoods;  