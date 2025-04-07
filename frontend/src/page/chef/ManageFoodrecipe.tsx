const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ObjectId } from 'mongodb';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';


import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';

interface FoodRecipe {
  _id: string;
  recipes_Quantity: number;
  recipes_Price: number;
  product_Id: any;
}

interface FormData {
  recipes_Quantity: number;
  recipes_Price: number;
  product_Id: string;
}

interface FoodRecipeDetailsProps {
  id: string;
  name: string;
  onClose: () => void;
}

const schema = yup.object({
  recipes_Quantity: yup.number().required('กรุณาใส่ปริมาณ'),
  recipes_Price: yup.number().required('กรุณาใส่ราคา'),
  product_Id: yup.string().required('กรุณาเลือกสินค้า'),
}).required();
const ManageFoodRecipe: React.FC<FoodRecipeDetailsProps> = ({ id, name, onClose }) => {
  const [rows, setRows] = useState<GridRowsProp<FoodRecipe>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
 

      const Response = await axios.get(`${API_URL}/api/data/getFoodRecipes/${id}`);
      setRows(Response.data.foodRecipes);
      setProducts(Response.data.product)

      console.log('Food Recipes:', Response.data);
      console.log('Food id:', id);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId);
      if (selectedRow) {
        setValue('recipes_Quantity', selectedRow.recipes_Quantity);
        setValue('recipes_Price', selectedRow.recipes_Price);
        setValue('product_Id', selectedRow.product_Id._id);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef[] = [
    { field: 'index', headerName: 'ลำดับ', flex: 0.9, width: 30, renderCell: (params) => rows.indexOf(params.row) + 1 },
    { field: 'product_Id', headerName: 'สินค้า', flex: 1, minWidth: 180, renderCell: (params) => params.row.product_Id?.product_Name },
    { field: 'recipes_Quantity', headerName: 'ปริมาณ', flex: 1, minWidth: 100 },
    { 
      field: 'recipes_unit', 
      headerName: 'หน่วย', 
      flex: 1, 
      minWidth: 100,
      renderCell: (params) => params.row.product_Id?.unitId?.unit_Name
    },
    { field: 'recipes_Price', headerName: 'ราคา', flex: 1, minWidth: 100, 
      align: 'center', // ข้อความชิดขวา
    }, // เพิ่มคอลัมน์ราคา
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditFoodRecipeClick(params.id as string)}>
          แก้ไข
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'ลบข้อมูล',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteFoodRecipeClick(params.id as string)}>
          ลบ
        </Button>
      ),
    },
  ];

  const handleEditFoodRecipeClick = (id: string) => {
    const foodRecipe = rows.find((row) => row._id === id);
    if (foodRecipe) {
      setValue('recipes_Quantity', foodRecipe.recipes_Quantity);
      setValue('product_Id', foodRecipe.product_Id._id);
      setSelectedRowId(id);
      setOpen(true);
    }
  };

  const handleDeleteFoodRecipeClick = async (id: GridRowId) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
    if (confirmDelete) {
      try {
        const foodRecipeId = rows.find((row) => row._id === id)?._id;
        if (foodRecipeId) {
          await axios.delete(`${API_URL}/api/data/deleteFoodRecipe/${foodRecipeId}`);

          const updatedRows = rows.filter((row) => row._id !== foodRecipeId);
          setRows(updatedRows);

          setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
        } else {
          alert('ไม่พบข้อมูลที่จะลบ');
        }
      } catch (error: any) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        setAlertMessage(<div>{error.response.data.message}</div>);
      }
    }
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
    console.log('Form Data:', data);

    try {
      if (selectedRowId !== null) {
        const updatedData = {
          recipes_Quantity: data.recipes_Quantity,
          recipes_Price: data.recipes_Price, // เพิ่ม recipes_Price
          food_Id: id,
          product_Id: data.product_Id,
        };

        await axios
          .put(`${API_URL}/api/data/updateFoodRecipe/${selectedRowId}`, updatedData)
          .then((response) => {
            console.log('Update successful', response.data);
            fetchData();
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);

            const updatedRows = rows.map((row) =>
              row._id === selectedRowId ? { ...row, ...updatedData } : row
            );
            setRows(updatedRows);
          })
          .catch((error: any) => {
            console.error('Error updating data:', error);
            setAlertMessage(<div>{error.response.data.message}</div>);
          });
      } else {
        const newData = {
          recipes_Quantity: data.recipes_Quantity,
          recipes_Price: data.recipes_Price,
          food_Id: id,
          product_Id: data.product_Id,
        };

        const response = await axios.post(
          `${API_URL}/api/data/addFoodRecipe`,
          newData
        );

        if (response.status === 201) {

          fetchData();
          setRows([...rows, response.data]);
          setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
        } else {
          setAlertMessage(<div>เกิดข้อผิดพลาดในการเพิ่มข้อมูล</div>)
        }
      }
      handleClose();
    } catch (error: any) {
      console.error('Error submitting data:', error);
      setAlertMessage(<div>{error.response.data.message}</div>);
    }
  };

  return (
    <div style={{ height: '90vh', width: '80vw', marginBottom: 70 }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขรายละเอียดสูตรอาหาร' : 'เพิ่มรายละเอียดสูตรอาหาร'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
              name="product_Id"
              control={control}
              rules={{ required: 'กรุณาเลือกสินค้า' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="สินค้า"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Id}
                  helperText={errors.product_Id?.message}
                  value={field.value || ''}
                  onChange={field.onChange}
                >
                  {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                      <MenuItem key={product._id} value={product._id}>
                        {product?.product_Name} {product?.unitId?.unit_Name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      กรุณาเพิ่มข้อมูล สินค้า ก่อน
                    </MenuItem>
                  )}
                </TextField>
              )}
            />
            <Controller
              name="recipes_Quantity"
              control={control}
              rules={{ required: 'กรุณากรอกปริมาณ' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ปริมาณ"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.recipes_Quantity}
                  helperText={errors.recipes_Quantity?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value || 0}
                />
              )}
            />

            <Controller
              name="recipes_Price"
              control={control}
              rules={{ required: "กรุณากรอกราคา" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ราคา/ปริมาณ"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.recipes_Price}
                  helperText={errors.recipes_Price?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                  value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error">
            ยกเลิก
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)} color="success">
            {selectedRowId ? 'อัปเดต' : 'เพิ่ม'}
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorBoundary>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      </ErrorBoundary>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
        <Button color="primary">{name}</Button>
        <Button onClick={onClose} variant="contained" startIcon={<CloseIcon />}>
          ปิดหน้ารายละเอียด
        </Button>
        <Button variant="contained" onClick={handleAddClick}>
          เพิ่มข้อมูล
        </Button>

        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess} />
      </div>
    </div>
  );
}

export default ManageFoodRecipe;