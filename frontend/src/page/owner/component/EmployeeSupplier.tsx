const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField ,MenuItem} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

import SuccessAlert from '../../../components/AlertSuccess';
import WarningAlert from '../../../components/AlertDivWarn';
import ErrorBoundary from '../../ErrorBoundary';

interface EmployeeSupplier {
  _id: string;
  employee_Sub_Name: string;
  bio: String,
  address: String,
  job_Title: String,
  date_Of_Birth: string;
  national_Id: string;
  supplier_Id: any; // Reference to Supplier Model
}

interface FormData {
  employee_Sub_Name: string;
  bio: String,
  address: String,
  job_Title: String,
  date_Of_Birth: string;
  national_Id: string;
  supplier_Id: string;
}

const EmployeeSupplier: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<EmployeeSupplier>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
    const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
    const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors }  } = useForm<FormData>();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/data/getEmployeeSuppliers`);
      setRows(response.data);

      const suppliersResponse = await axios.get(`${API_URL}/api/data/getSuppliers`);
      setSuppliers(suppliersResponse.data);

      console.log("พนักงาน",response.data)
      console.log("ร้านค้า",suppliersResponse.data)

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
        setValue('employee_Sub_Name', selectedRow.employee_Sub_Name);
        setValue('bio', selectedRow.bio);
        setValue('address', selectedRow.address);
        setValue('job_Title', selectedRow.job_Title);
        setValue('date_Of_Birth', selectedRow.date_Of_Birth);
        setValue('national_Id', selectedRow.national_Id);
        setValue('supplier_Id', selectedRow.supplier_Id?._id);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef[] = [
    { field: 'index', headerName: 'ลำดับ', flex: 0.9 ,minWidth: 30, renderCell: (params) => rows.indexOf(params.row) + 1 },
    { field: 'employee_Sub_Name', headerName: 'ชื่อพนักงาน', flex: 1 ,minWidth: 150},
    { field: 'bio', headerName: 'ข้อมูลเพิ่มเติม', flex: 1 ,minWidth: 200},
    { field: 'address', headerName: 'ที่อยู่', flex: 1 , minWidth: 250},
    { field: 'job_Title', headerName: 'ตำแหน่งงาน', flex: 1, minWidth: 100},
    { field: 'date_Of_Birth', headerName: 'วันเกิด', flex: 1 ,minWidth: 100},
    { field: 'national_Id', headerName: 'เลขบัตรประชาชน', flex: 1 ,minWidth: 130},
    {
      field: 'supplier_Id',
      headerName: 'ร้านที่สังกัด',
      flex: 1,
      renderCell: (params) => params.row.supplier_Id?.supplier_Name,
    },
    {
      field: 'actions',
      headerName: 'แก้ไข',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditClick(params.id)}>
          แก้ไข
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'ลบ',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteClick(params.id)}>
          ลบ
        </Button>
      ),
    },
  ];

  const handleDeleteClick = async (id: GridRowId) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลพนักงานซัพพลายเออร์นี้?');
    if (confirmDelete) {
      try {
        const employeeId = rows.find((row) => row._id === id)?._id;
        if (employeeId) {
          // เรียก API เพื่อลบข้อมูล
          await axios.delete(`${API_URL}/api/data/deleteEmployeeSupplier/${employeeId}`);
  
          // อัปเดต state ลบแถวที่ถูกลบออก
          setRows(rows.filter((row) => row._id !== employeeId));
          setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
        } else {
          alert('ไม่พบข้อมูลพนักงานซัพพลายเออร์');
        }
      } catch (error: any) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        setAlertMessage(<div>{error.response?.data?.message || 'เกิดข้อผิดพลาด'}</div>);
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
        // อัปเดตข้อมูลพนักงานซัพพลายเออร์
        const updatedData = {
          employee_Sub_Name: data.employee_Sub_Name,
          bio: data.bio,
          address: data.address,
          job_Title: data.job_Title,
          date_Of_Birth: data.date_Of_Birth,
          national_Id: data.national_Id,
          supplier_Id: data.supplier_Id || null,
        };
  
        console.log(updatedData);
  
        await axios.put(`${API_URL}/api/data/updateEmployeeSupplier/${selectedRowId}`, updatedData)
          .then((response) => {
            console.log("Update successful", response.data);
            fetchData();
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);
          })
          .catch((error: any) => {
            console.error("Error updating data:", error);
            setAlertMessage(<div>{error.response?.data?.message || 'เกิดข้อผิดพลาด'}</div>);
          });
      } else {
        // เพิ่มพนักงานซัพพลายเออร์ใหม่
        const response = await axios.post(`${API_URL}/api/data/addEmployeeSupplier`, data);
        fetchData();
        setAlertSuccess(<div>{response.data.message}</div>);
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
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลพนักงานซัพพลายเออร์' : 'เพิ่มพนักงานซัพพลายเออร์'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="employee_Sub_Name"
              control={control}
              rules={{ required: "กรุณากรอกชื่อพนักงาน" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อพนักงาน"
                  fullWidth
                  margin="dense"
                  error={!!errors.employee_Sub_Name}
                  helperText={errors.employee_Sub_Name?.message}
                />
              )}
            />
  
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ข้อมูลเพิ่มเติม (Bio)"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={2}
                />
              )}
            />
  
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ที่อยู่"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={2}
                />
              )}
            />
  
            <Controller
              name="job_Title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ตำแหน่งงาน"
                  fullWidth
                  margin="dense"
                />
              )}
            />
  
            <Controller
              name="date_Of_Birth"
              control={control}
              rules={{ required: "กรุณาเลือกวันเกิด" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="วันเกิด"
                  type="date"
                  fullWidth
                  margin="dense"
                  error={!!errors.date_Of_Birth}
                  helperText={errors.date_Of_Birth?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
  
            <Controller
              name="national_Id"
              control={control}
              rules={{
                required: "กรุณากรอกเลขบัตรประชาชน",
                pattern: {
                  value: /^[0-9]{13}$/,
                  message: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="เลขบัตรประชาชน"
                  fullWidth
                  margin="dense"
                  error={!!errors.national_Id}
                  helperText={errors.national_Id?.message}
                />
              )}
            />
  
            <Controller
              name="supplier_Id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="ซัพพลายเออร์"
                  fullWidth
                  margin="dense"
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier._id} value={supplier._id}>
                      {supplier.supplier_Name}
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

export default EmployeeSupplier
  