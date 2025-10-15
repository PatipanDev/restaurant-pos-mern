const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import WarningAlert from '../../../components/AlertDivWarn';
import SuccessAlert from '../../../components/AlertSuccess';
import ErrorBoundary from '../../ErrorBoundary';


interface Supplier {
  _id: string;
  supplier_Name: string;
  supplier_Address: string;
  supplier_Phone: string;
  supplier_Name_Owner?: string;
  supplier_Details?: string;
}

interface FormData {
  supplier_Name: string;
  supplier_Address: string;
  supplier_Phone: string ;
  supplier_Name_Owner?: string | undefined ;
  supplier_Details?: string| undefined;
}

const schema = yup.object({
  supplier_Name: yup.string().required('กรุณาใส่ชื่อผู้จำหน่าย').max(100, 'ชื่อผู้จำหน่ายต้องไม่เกิน 100 ตัวอักษร'),
  supplier_Address: yup.string().required('กรุณาใส่ที่อยู่').max(255, 'ที่อยู่ต้องไม่เกิน 255 ตัวอักษร'),
  supplier_Phone: yup.string().required('กรุณาใส่เบอร์มือถือ').max(10, 'หมายเลขโทรศัพท์ต้องไม่เกิน 10 ตัวอักษร'),
  supplier_Name_Owner: yup.string().max(100, 'ชื่อเจ้าของต้องไม่เกิน 100 ตัวอักษร'),
  supplier_Details: yup.string(),
}).required();

const ShopSupplier: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Supplier>>([]);
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
        const response = await axios.get(`${API_URL}/api/data/getSuppliers`); // Replace with API for suppliers
        setRows(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId) as Supplier;
      if (selectedRow) {
        setValue('supplier_Name', selectedRow.supplier_Name);
        setValue('supplier_Address', selectedRow.supplier_Address);
        setValue('supplier_Phone', selectedRow.supplier_Phone);
        setValue('supplier_Name_Owner', selectedRow.supplier_Name_Owner);
        setValue('supplier_Details', selectedRow.supplier_Details);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Supplier>[] = [
    { field: 'index', headerName: 'ลำดับ', flex: 0.9, width: 30, renderCell: (params) => rows.indexOf(params.row) + 1 },
    { field: 'supplier_Name', headerName: 'ชื่อผู้จำหน่าย', flex: 1, minWidth: 150 },
    { field: 'supplier_Address', headerName: 'ที่อยู่', flex: 1, minWidth: 150 },
    { field: 'supplier_Phone', headerName: 'หมายเลขโทรศัพท์', flex: 1, minWidth: 150 },
    { field: 'supplier_Name_Owner', headerName: 'ชื่อเจ้าของ', flex: 1, minWidth: 150 },
    { field: 'supplier_Details', headerName: 'รายละเอียด', flex: 1, minWidth: 150 },
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
        const supplierId = rows.find((row) => row._id === id)?._id;
        if (supplierId) {
          await axios.delete(`${API_URL}/api/data/deleteEmployeeSupplier/${supplierId}`); // Replace with API for deleting suppliers

          const updatedRows = rows.filter((row) => row._id !== supplierId);
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
    try {
      if (selectedRowId !== null) {
        const updatedData = {
          supplier_Name: data.supplier_Name,
          supplier_Address: data.supplier_Address,
          supplier_Phone: data.supplier_Phone,
          supplier_Name_Owner: data.supplier_Name_Owner,
          supplier_Details: data.supplier_Details,
        };

        await axios.put(`${API_URL}/api/data/updateSupplier/${selectedRowId}`, updatedData) // Replace with API for updating supplier
          .then((_) => {
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);
            const updatedRows = rows.map((row) =>
              row._id === selectedRowId ? { ...row, ...updatedData } : row
            );
            setRows(updatedRows);
          })
          .catch((error) => {
            console.log(error)
            setAlertMessage(<div>เกิดข้อผิดพลาดในการอัปเดตข้อมูล</div>);
          });
      } else {
        const response = await axios.post(`${API_URL}/api/data/addSupplier`, data); // Replace with API for creating a supplier
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
    <div style={{ height: '77vh', width: '80vw' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลผู้จำหน่าย' : 'เพิ่มข้อมูลผู้จำหน่าย'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="supplier_Name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อผู้จำหน่าย"
                  fullWidth
                  margin="dense"
                  error={!!errors.supplier_Name}
                  helperText={errors.supplier_Name?.message}
                />
              )}
            />
            <Controller
              name="supplier_Address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ที่อยู่"
                  fullWidth
                  margin="dense"
                  error={!!errors.supplier_Address}
                  helperText={errors.supplier_Address?.message}
                />
              )}
            />
            <Controller
              name="supplier_Phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="หมายเลขโทรศัพท์"
                  fullWidth
                  margin="dense"
                  error={!!errors.supplier_Phone}
                  helperText={errors.supplier_Phone?.message}
                />
              )}
            />
            <Controller
              name="supplier_Name_Owner"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อเจ้าของ"
                  fullWidth
                  margin="dense"
                  error={!!errors.supplier_Name_Owner}
                  helperText={errors.supplier_Name_Owner?.message}
                />
              )}
            />
            <Controller
              name="supplier_Details"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="รายละเอียด"
                  fullWidth
                  margin="dense"
                  error={!!errors.supplier_Details}
                  helperText={errors.supplier_Details?.message}
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
};

export default ShopSupplier;