import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import moment from 'moment'; // เพิ่ม import moment
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';
import Skeleton from '@mui/material/Skeleton';
import LoadingSpinner from './component/LoadingSpinner';


interface Employee {
  _id: string;
  employee_Name: string;
  employee_Password: string;
  employee_Citizen_id: string;
  employee_Weight: number;
  employee_Height: number;
  employee_Address: string;
  employee_Details: string;
  employee_Birthday: Date;
}

interface FormData {
  employee_Name: string;
  employee_Password: string;
  employee_Citizen_id: string;
  employee_Weight: number;
  employee_Height: number;
  employee_Address: string;
  employee_Details: string;
  employee_Birthday: Date;
}

const schema = yup.object({
  employee_Name: yup.string().required('กรุณาใส่ชื่อ').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  employee_Password: yup.string().required('กรุณาใส่รหัสผ่าน').min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').max(255, 'รหัสผ่านต้องไม่เกิน 255 ตัวอักษร'),
  employee_Citizen_id: yup.string().required('กรุณาใส่เลขบัตรประชาชน').matches(/^[0-9]{13}$/, 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก'),
  employee_Weight: yup.number().required('กรุณาใส่น้ำหนัก').min(1, 'น้ำหนักต้องมากกว่า 1').max(500, 'น้ำหนักต้องน้อยกว่า 500'),
  employee_Height: yup.number().required('กรุณาใส่ส่วนสูง').min(30, 'ส่วนสูงต้องมากกว่า 30').max(250, 'ส่วนสูงต้องน้อยกว่า 250'),
  employee_Address: yup.string().required('กรุณาใส่ที่อยู่'),
  employee_Details: yup.string().required('กรุณาใส่รายละเอียด'),
  employee_Birthday: yup.date().required('กรุณาใส่วันเกิด'),
}).required();

const DataGridEdit: React.FC = () => {
  // const [loading, setLoading] = useState(true);  // กำหนดสถานะการโหลด
  const [rows, setRows] = useState<GridRowsProp<Employee>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  //ส่วนของการแจ้งเตือน
    const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
    const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/getemployees'); // แทนที่ด้วย endpoint ของคุณ
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
      const selectedRow = rows.find((row) => row._id === selectedRowId) as Employee
      setValue('employee_Name', selectedRow.employee_Name);
      setValue('employee_Password', selectedRow.employee_Password);
      setValue('employee_Citizen_id', selectedRow.employee_Citizen_id);
      setValue('employee_Weight', selectedRow.employee_Weight);
      setValue('employee_Height', selectedRow.employee_Height);
      setValue('employee_Address', selectedRow.employee_Address);
      setValue('employee_Details', selectedRow.employee_Details);
      setValue('employee_Birthday', selectedRow.employee_Birthday);
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Employee>[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      width: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    { field: 'employee_Name', headerName: 'ชื่อ', flex: 1, minWidth: 180 },
    { field: 'employee_Citizen_id', headerName: 'เลขบัตรประชาชน', flex: 1, minWidth: 200 },
    { field: 'employee_Weight', headerName: 'น้ำหนัก', flex: 1, minWidth: 100 },
    { field: 'employee_Height', headerName: 'ส่วนสูง', flex: 1, minWidth: 100 },
    { field: 'employee_Address', headerName: 'ที่อยู่', flex: 2, minWidth: 200 }, // flex: 2 ให้คอลัมน์นี้ใช้พื้นที่มากกว่าคอลัมน์อื่น
    { field: 'employee_Details', headerName: 'รายละเอียด', flex: 2, minWidth: 200 }, // flex: 2 ให้คอลัมน์นี้ใช้พื้นที่มากกว่าคอลัมน์อื่น
    { field: 'employee_Birthday', headerName: 'วันเกิด', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100, // คอลัมน์นี้ยังคงความกว้างคงที่
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditClick(params.id)}>แก้ไข</Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'ลบข้อมูล',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<DeleteIcon />}color="error" onClick={() => handleDeleteClick(params.id)}>ลบ</Button>
      ),
    },
    
  ];


  const handleDeleteClick = async (id: GridRowId) => {
    // console.log(id)
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
    if (confirmDelete) {
        try {
            // ใช้ params.row._id แทน params.id ถ้าต้องการใช้ _id ใน MongoDB
            const employeeId = rows.find((row) => row._id === id)?._id;
            if (employeeId) {
                // ส่งคำขอ DELETE ไปยัง API โดยใช้ 'employeeId' ที่ตรงกับ _id ของข้อมูล
                await axios.delete(`http://localhost:3000/api/auth/deleteemployee/${employeeId}`);
                // console.log(employeeId)

                // อัพเดต state ของแถวใน local หลังจากลบสำเร็จ
                const updatedRows = rows.filter((row) => row._id !== employeeId);
                setRows(updatedRows);

                setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>)
            } else {
                alert('ไม่พบข้อมูลที่จะลบ');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
            // alert('ไม่สามารถลบข้อมูลได้');
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

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      if (selectedRowId !== null) {
        const updatedData = {
          employee_Name: data.employee_Name,
          employee_Password: data.employee_Password, // อาจต้องเช็คว่ามีการเปลี่ยนรหัสผ่านหรือไม่
          employee_Weight: Number(data.employee_Weight),
          employee_Height: Number(data.employee_Height),
          employee_Address: data.employee_Address,
          employee_Details: data.employee_Details,
          employee_Birthday: data.employee_Birthday,
        };

        await axios.put(
          `http://localhost:3000/api/auth/updateemployee/${selectedRowId}`,
          updatedData
        )
        .then(response => {
          console.log('Update successful', response.data);
        setAlertSuccess(<div>อัตเดตข้อมูลสำเร็จ</div>)

          // อัปเดตข้อมูลที่แสดงใน UI
          const updatedRows = rows.map((row) =>
            row._id === selectedRowId ? { ...row, ...updatedData } : row
          );
          setRows(updatedRows);
        })
      } else {
        // เพิ่มข้อมูลใหม่
        const response = await axios.post('http://localhost:3000/api/auth/registeremployee', data); // แทนที่ด้วย endpoint ของคุณ
        setRows([...rows, response.data]);
        setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>)
      }
      handleClose();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (

    <div style={{ height: '90vh', width: '100%' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="employee_Name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="ชื่อ" fullWidth margin="dense" error={!!errors.employee_Name} helperText={errors.employee_Name?.message} />
              )}
            />
            <Controller
              name="employee_Password"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="password" label="รหัสผ่าน" fullWidth margin="dense" error={!!errors.employee_Password} helperText={errors.employee_Password?.message} />
              )}
            />
            <Controller
              name="employee_Citizen_id"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="เลขบัตรประชาชน" fullWidth margin="dense" error={!!errors.employee_Citizen_id} helperText={errors.employee_Citizen_id?.message} />
              )}
            />
            <Controller
              name="employee_Weight"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="น้ำหนัก" fullWidth margin="dense" error={!!errors.employee_Weight} helperText={errors.employee_Weight?.message} />
              )}
            />
            <Controller
              name="employee_Height"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="number" label="ส่วนสูง" fullWidth margin="dense" error={!!errors.employee_Height} helperText={errors.employee_Height?.message} />
              )}
            />
            <Controller
              name="employee_Address"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="ที่อยู่" fullWidth margin="dense" error={!!errors.employee_Address} helperText={errors.employee_Address?.message} />
              )}
            />
            <Controller
              name="employee_Details"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="รายละเอียด" fullWidth margin="dense" error={!!errors.employee_Details} helperText={errors.employee_Details?.message} />
              )}
            />
            <Controller
              name="employee_Birthday"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" label="วันเกิด" fullWidth margin="dense" InputLabelProps={{ shrink: true }} error={!!errors.employee_Birthday} helperText={errors.employee_Birthday?.message} />
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
        <Button
          variant="contained"
          onClick={handleAddClick}
        >
          เพิ่มข้อมูล
        </Button>
        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess}/>
      </div>
      {/* ... (Dialog) */}
    </div>
  );
};

export default DataGridEdit;