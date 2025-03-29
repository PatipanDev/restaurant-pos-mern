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
import SuccessAlert from '../../../components/AlertSuccess';
import WarningAlert from '../../../components/AlertDivWarn';
import ErrorBoundary from '../../ErrorBoundary';

interface Supplier {
  _id: string;
  supplier_Address: string;
  supplier_Name: string;
  supplier_Phone: string; // Optional field
  supplier_Name_Owner: string; // Optional field
  supplier_Details: string; // Optional field
}

interface FormData {
  supplier_Address: string;
  supplier_Name: string;
  supplier_Phone: string;
  supplier_Name_Owner?: string | undefined;
  supplier_Details: string; 
}

const schema = yup.object({
  supplier_Address: yup.string().required('กรุณาใส่ที่อยู่ผู้จำหน่าย').max(255, 'ที่อยู่ต้องไม่เกิน 255 ตัวอักษร'),
  supplier_Name: yup.string().required('กรุณาใส่ชื่อผู้จำหน่าย').max(100, 'ชื่อผู้จำหน่ายต้องไม่เกิน 100 ตัวอักษร'),
  supplier_Phone: yup.string().required('กรุณาใส่ชื่อผู้จำหน่าย').max(10, 'เบอร์โทรศัพท์ต้องไม่เกิน 10 ตัวอักษร'),// Optional and max 10
  supplier_Name_Owner: yup.string().max(100, 'ชื่อผู้ติดต่อต้องไม่เกิน 100 ตัวอักษร'), // Optional and max 100
  supplier_Details: yup.string().required('กรุณาใส่ชื่อผู้จำหน่าย'), // Optional
}).required();

const ManageSuppliers: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Supplier>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
      const suppliersResponse = await axios.get(`${API_URL}/api/data/getSuppliers`);
      setRows(suppliersResponse.data);
      console.log('Suppliers:', suppliersResponse.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.5, // Adjust flex as needed
      width: 50,
      renderCell: (params) => rows.indexOf(params.row) + 1,
      sortable: false, // Assuming you don't want to sort by index
    },
    { field: 'Supplier_Name', headerName: 'ชื่อผู้จำหน่าย', flex: 1, minWidth: 180 },
    { field: 'Supplier_Address', headerName: 'ที่อยู่', flex: 2, minWidth: 250 },
    { field: 'Supplier_Phone', headerName: 'เบอร์โทรศัพท์', flex: 1, minWidth: 120 },
    { field: 'Supplier_Name_Owner', headerName: 'ผู้ติดต่อ', flex: 1, minWidth: 150 },
    { field: 'Supplier_Details', headerName: 'รายละเอียด', flex: 2, minWidth: 200 },
    {
      field: 'actions',
      headerName: 'แก้ไข',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEdit(params.row._id)}>
          แก้ไข
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'ลบ',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDelete(params.row._id)}>
          ลบ
        </Button>
      ),
    },
  ];

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้จำหน่ายนี้?')) {
      try {
        await axios.delete(`${API_URL}/api/data/deletesupplier/${id}`);
        setAlertSuccess(<div>"ลบผู้จำหน่ายสำเร็จ</div> );
        fetchData(); // Refresh data
        setTimeout(() => setAlertSuccess(null), 3000);
      } catch (error: any) {
        console.error('Error deleting supplier:', error);
        setAlertMessage(<div>"ลบผู้จำหน่ายสำเร็จ</div> );
        setTimeout(() => setAlertMessage(null), 5000);
      }
    }
  };

  const handleEdit = (id: GridRowId) => {
    setSelectedRowId(id);
    setOpen(true);
  };

  const handleAdd = () => {
    setSelectedRowId(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  // On form submission, either create a new supplier or update an existing one
  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      if (selectedRowId !== null) {
        // Update an existing supplier
        const updatedData = {
          supplier_Address: data.supplier_Address,
          supplier_Name: data.supplier_Name,
          supplier_Phone: data.supplier_Phone,
          supplier_Name_Owner: data.supplier_Name_Owner,
          supplier_Details: data.supplier_Details,
        };

        console.log("Updated Supplier Data:", updatedData);

        // Correct the URL and data for updating supplier
        await axios
          .put(`${API_URL}/api/data/updatesupplier/${selectedRowId}`, updatedData)
          .then((response) => {
            console.log("Update successful", response.data);
            fetchData();
            setAlertSuccess(<div>อัพเดตข้อมูลสำเร็จ</div> );
          })
          .catch((error: any) => {
            console.error("Error updating supplier data:", error);
            setAlertMessage(<div>{error.response.message}</div> );
          });
      } else {
        // Add a new supplier
        await axios
          .post(`${API_URL}/api/data/addsupplier`, data)
          .then((response) => {
            console.log("Add successful", response.data);
            fetchData();
            setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div> );
          })
          .catch((error: any) => {
            console.error("Error adding supplier data:", error);
            setAlertMessage(<div>{error.response.message}</div> );
          });
      }
      handleClose(); // Close the form dialog
    } catch (error) {
      console.error("Error submitting supplier data:", error);
      setAlertMessage(<div></div> );
    }
  };

  return (
    <div>
      {alertMessage}
      {alertSuccess}
     
      <div style={{ height: '75vh', width: '80vw' }}>
        <ErrorBoundary>
          <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
        </ErrorBoundary>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
  <Button variant="contained" color="primary" onClick={handleAdd} style={{ margin: 5 }}>
    เพิ่มผู้จำหน่าย
  </Button>
</div>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedRowId ? 'แก้ไขผู้จำหน่าย' : 'เพิ่มผู้จำหน่าย'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="supplier_Name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อร้านหรือบริษัทจำหน่าย"
                  fullWidth
                  margin="normal"
                  error={!!errors.supplier_Name}
                  helperText={errors.supplier_Name?.message}
                />
              )}
            />
            <Controller
              name="supplier_Address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ที่อยู่"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!errors.supplier_Address}
                  helperText={errors.supplier_Address?.message}
                />
              )}
            />
            <Controller
              name="supplier_Phone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="เบอร์โทรศัพท์"
                  fullWidth
                  margin="normal"
                  error={!!errors.supplier_Phone}
                  helperText={errors.supplier_Phone?.message}
                />
              )}
            />
            <Controller
              name="supplier_Name_Owner"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="เจ้าของหรือบุคคลดูแล"
                  fullWidth
                  margin="normal"
                  error={!!errors.supplier_Name_Owner}
                  helperText={errors.supplier_Name_Owner?.message}
                />
              )}
            />
            <Controller
              name="supplier_Details"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="รายละเอียด"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!errors.supplier_Details}
                  helperText={errors.supplier_Details?.message}
                />
              )}
            />
            <DialogActions>
              <Button onClick={handleClose}>ยกเลิก</Button>
              <Button type="submit" color="primary">
                {selectedRowId ? 'บันทึกการแก้ไข' : 'เพิ่ม'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSuppliers;