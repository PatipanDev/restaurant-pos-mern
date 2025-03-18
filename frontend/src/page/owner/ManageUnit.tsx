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

interface Unit {
  _id: string;
  unit_Name: string;
  unit_Symbol: string;
}

interface FormData {
  unit_Name: string;
  unit_Symbol: string;
}

const schema = yup.object({
  unit_Name: yup.string().required('กรุณาใส่ชื่อหน่วยสินค้า').max(50, 'ชื่อหน่วยสินค้าไม่เกิน 50 ตัวอักษร'),
  unit_Symbol: yup.string().required('กรุณาใส่สัญลักษณ์หน่วยสินค้า').max(10, 'สัญลักษณ์หน่วยสินค้าไม่เกิน 10 ตัวอักษร'),
}).required();

const ManageUnits: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Unit>>([]);
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
        const response = await axios.get(`${API_URL}/api/data/getunits`); // ใช้ API ที่เกี่ยวกับ Unit
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
      const selectedRow = rows.find((row) => row._id === selectedRowId) as Unit;
      if (selectedRow) {
        setValue('unit_Name', selectedRow.unit_Name);
        setValue('unit_Symbol', selectedRow.unit_Symbol);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Unit>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'unit_Name', headerName: 'ชื่อหน่วยสินค้า', flex: 1, minWidth: 180 },
    { field: 'unit_Symbol', headerName: 'สัญลักษณ์หน่วย', flex: 1, minWidth: 100 },
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
        const unitId = rows.find((row) => row._id === id)?._id;
        if (unitId) {
          await axios.delete(`${API_URL}/api/data/deleteunit/${unitId}`); // ใช้ API สำหรับลบ Unit

          const updatedRows = rows.filter((row) => row._id !== unitId);
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
    console.log("Form Data:", data);

    try {
      if (selectedRowId !== null) {
        const updatedData = {
          unit_Name: data.unit_Name,
          unit_Symbol: data.unit_Symbol,
        };

        await axios
          .put(`${API_URL}/api/data/updateunit/${selectedRowId}`, updatedData) // ใช้ API สำหรับอัปเดต Unit
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
          `${API_URL}/api/data/createunit`, // ใช้ API สำหรับสร้าง Unit
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
        <DialogTitle>{selectedRowId ? 'แก้ไขหน่วยสินค้า' : 'เพิ่มหน่วยสินค้า'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="unit_Name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อหน่วยสินค้า"
                  fullWidth
                  margin="dense"
                  error={!!errors.unit_Name}
                  helperText={errors.unit_Name?.message}
                  value={field.value || ""} // ป้องกัน undefined
                />
              )}
            />
            <Controller
              name="unit_Symbol"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="สัญลักษณ์หน่วย"
                  fullWidth
                  margin="dense"
                  error={!!errors.unit_Symbol}
                  helperText={errors.unit_Symbol?.message}
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
        <Button variant="contained" onClick={handleAddClick}>เพิ่มหน่วยสินค้า</Button>
        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess} />
      </div>
    </div>
  );
};

export default ManageUnits;
