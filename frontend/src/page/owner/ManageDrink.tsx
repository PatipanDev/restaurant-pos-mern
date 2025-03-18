const API_URL = import.meta.env.VITE_API_URL;

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

interface Drink {
  _id: string;
  drink_Name: string;
  drink_Price: number;
  drink_Quantity: number;
  drink_Stock_quantity: number;
  drink_Manufacture_date: string;
  drink_Expiry_date: string;

}

interface FormData {
  drink_Name: string;
  drink_Price: number;
  drink_Quantity: number;
  drink_Stock_quantity: number;
  drink_Manufacture_date: string;
  drink_Expiry_date: string;
}

const schema = yup.object({
  drink_Name: yup.string().required('กรุณาใส่ชื่อเครื่องดื่ม').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  drink_Price: yup.number().required('กรุณาใส่ราคา').min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  drink_Quantity: yup.number().required('กรุณาใส่ปริมาณ').min(1, 'ปริมาณต้องมากกว่า 0'),
  drink_Stock_quantity: yup.number().required('กรุณาใส่ปริมาณคงเหลือ').min(0, 'ปริมาณคงเหลือต้องไม่ต่ำกว่า 0'),
  drink_Manufacture_date: yup.string().required('กรุณาใส่วันที่ผลิต'),
  drink_Expiry_date: yup.string().required('กรุณาใส่วันหมดอายุ'),
}).required();

const ManageDrinks: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Drink>>([]);
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
        const drinksResponse = await axios.get(`${API_URL}/api/data/getDrinks`); // Endpoint สำหรับดึงข้อมูลเครื่องดื่ม
        setRows(drinksResponse.data);
        console.log('Drinks:', drinksResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddDrink = async (data: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/api/data/addDrink`, data); // Endpoint สำหรับเพิ่มเครื่องดื่ม
      setRows([...rows, response.data]);
      setAlertSuccess('Drink added successfully!');
      setOpen(false);
    } catch (error) {
      setAlertMessage('Error adding drink.');
      console.error(error);
    }
  };

  const handleDeleteDrink = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/data/deleteDrink/${id}`); // Endpoint สำหรับลบเครื่องดื่ม
      setRows(rows.filter((row) => row._id !== id));
      setAlertSuccess('Drink deleted successfully!');
    } catch (error) {
      setAlertMessage('Error deleting drink.');
      console.error(error);
    }
  };

  const handleEditDrink = (id: string) => {
    const drink = rows.find((row) => row._id === id);
    if (drink) {
      setValue('drink_Name', drink.drink_Name);
      setValue('drink_Price', drink.drink_Price);
      setValue('drink_Quantity', drink.drink_Quantity);
      setValue('drink_Stock_quantity', drink.drink_Stock_quantity);
      setValue('drink_Manufacture_date', drink.drink_Manufacture_date);
      setValue('drink_Expiry_date', drink.drink_Expiry_date);
      setSelectedRowId(id);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId);
      if (selectedRow) {
        setValue('drink_Name', selectedRow.drink_Name);
        setValue('drink_Price', selectedRow.drink_Price);
        setValue('drink_Quantity', selectedRow.drink_Quantity);
        setValue('drink_Stock_quantity', selectedRow.drink_Stock_quantity);
        setValue('drink_Manufacture_date', selectedRow.drink_Manufacture_date);
        setValue('drink_Expiry_date', selectedRow.drink_Expiry_date);
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
    { field: 'drink_Name', headerName: 'ชื่อเครื่องดื่ม', flex: 1, minWidth: 180 },
    { field: 'drink_Price', headerName: 'ราคา', flex: 1, minWidth: 120 },
    { field: 'drink_Quantity', headerName: 'ปริมาณ', flex: 1, minWidth: 100 },
    { field: 'drink_Stock_quantity', headerName: 'จำนวนคงเหลือ', flex: 1, minWidth: 150 },
    { field: 'drink_Manufacture_date', headerName: 'วันที่ผลิต', flex: 1, minWidth: 150 },
    { field: 'drink_Expiry_date', headerName: 'วันหมดอายุ', flex: 1, minWidth: 150 },
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
          await axios.delete(`${API_URL}/api/data/deleteDrink/${drinkId}`); // ใช้ endpoint ที่ถูกต้อง
  
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
  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
  
    try {
      if (selectedRowId !== null) {
        // Update an existing drink
        const updatedData = {
          drink_Name: data.drink_Name,
          drink_Price: data.drink_Price,
          drink_Quantity: data.drink_Quantity,
          drink_Stock_quantity: data.drink_Stock_quantity,
          drink_Manufacture_date: data.drink_Manufacture_date,
          drink_Expiry_date: data.drink_Expiry_date,
        };
  
        // Correct the URL and data
        await axios
          .put(`${API_URL}/api/data/updateDrink/${selectedRowId}`, updatedData)
          .then((response) => {
            console.log("Update successful", response.data);
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);
  
            // Update the rows in the state with the new data
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
        // Add a new drink
        const response = await axios.post(
          `${API_URL}/api/data/addDrink`,
          data
        );
        setRows([...rows, response.data]);
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