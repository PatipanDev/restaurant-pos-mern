import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
// import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';
import SuccessAlert from '../../components/AlertSuccess';

interface Table {
  _id: string;
  number: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  seat_count: number;
}

interface FormData {
  number: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  seat_count: number;
}

const schema = yup.object({
  number: yup.number().required('กรุณาใส่หมายเลขโต๊ะ').min(1, 'หมายเลขโต๊ะต้องมากกว่าหรือเท่ากับ 1').max(100, 'หมายเลขโต๊ะต้องไม่เกิน 100'),
  status: yup.string().oneOf(['Available', 'Occupied', 'Reserved'], 'กรุณาเลือกสถานะ').required('กรุณาเลือกสถานะ'),
  seat_count: yup.number().required('กรุณาใส่จำนวนที่นั่ง').min(1, 'จำนวนที่นั่งต้องมากกว่า 0').max(10, 'จำนวนที่นั่งต้องไม่เกิน 10'),
}).required();

const ManageTable: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Table>>([]);
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
        const response = await axios.get('http://localhost:3000/api/data/gettables'); // เปลี่ยน URL ให้ตรงกับ API สำหรับ Table
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId) as Table;
      if (selectedRow) {
        setValue('number', selectedRow.number);
        setValue('status', selectedRow.status);
        setValue('seat_count', selectedRow.seat_count);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Table>[] = [
    { field: 'index', headerName: 'ลำดับ', flex: 0.9, width: 30, renderCell: (params) => rows.indexOf(params.row) + 1 },
    { field: 'number', headerName: 'หมายเลขโต๊ะ', flex: 1, minWidth: 150 },
    { field: 'status', headerName: 'สถานะ', flex: 1, minWidth: 150 },
    { field: 'seat_count', headerName: 'จำนวนที่นั่ง', flex: 1, minWidth: 150 },
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
        const tableId = rows.find((row) => row._id === id)?._id;
        if (tableId) {
          await axios.delete(`http://localhost:3000/api/data/deletetable/${tableId}`); // เปลี่ยน URL ให้ตรงกับ API สำหรับลบ Table

          const updatedRows = rows.filter((row) => row._id !== tableId);
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
          number: data.number,
          status: data.status,
          seat_count: data.seat_count,
        };

        await axios
          .put(`http://localhost:3000/api/data/updatetable/${selectedRowId}`, updatedData)
          .then((response) => {
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);
            const updatedRows = rows.map((row) =>
              row._id === selectedRowId ? { ...row, ...updatedData } : row
            );
            setRows(updatedRows);
          })
          .catch((error) => {
            setAlertMessage(<div>เกิดข้อผิดพลาดในการอัปเดตข้อมูล</div>);
          });
      } else {
        const response = await axios.post('http://localhost:3000/api/data/createtable', data);
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
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลโต๊ะ' : 'เพิ่มข้อมูลโต๊ะ'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="หมายเลขโต๊ะ" fullWidth margin="dense" error={!!errors.number} helperText={errors.number?.message} />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField select {...field} label="สถานะ" fullWidth margin="dense" error={!!errors.status} helperText={errors.status?.message}>
                  <MenuItem value="Available">ว่าง</MenuItem>
                  <MenuItem value="Occupied">กำลังใช้งาน</MenuItem>
                  <MenuItem value="Reserved">จอง</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="seat_count"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="จำนวนที่นั่ง" fullWidth margin="dense" error={!!errors.seat_count} helperText={errors.seat_count?.message} />
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

export default ManageTable;
