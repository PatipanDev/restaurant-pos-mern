const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { HistoryEdu, Receipt } from '@mui/icons-material';


import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';

import DoceFaltur from './component/DoceFaktur';


interface OrderProduct {
  _id: string;
  sender_Name: string;
  receiver_Name: string;
  description: string;
  shipment_Date: Date;
  delivery_Status: string;
  supplier_Id: string;
  orderproduct_id: string;
}

interface FormData {
  sender_Name: string;
  receiver_Name: string;
  description: string;
  shipment_Date: Date;
  delivery_Status: string;
  supplier_Id: string;
  orderproduct_id: string;
}

const schema = yup.object({
  sender_Name: yup.string().required('กรุณาใส่ชื่อผู้ส่ง').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  receiver_Name: yup.string().required('กรุณาใส่ชื่อผู้รับ'),
  description: yup.string().required('กรุณาใส่คำอธิบาย'),
  shipment_Date: yup.date().required('กรุณาใส่วันที่จัดส่ง'),
  delivery_Status: yup.string().required('กรุณาใส่สถานะการจัดส่ง'),
  supplier_Id: yup.string().required('กรุณาใส่รหัสซัพพลายเออร์'),
  orderproduct_id: yup.string().required('กรุณาใส่รหัสสินค้า'),
});


const translateStatus = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'รอดำเนินการ';
    case 'In Progress':
      return 'กำลังดำเนินการ';
    case 'Completed':
      return 'เสร็จสิ้น';
    case 'Cancelled':
      return 'ยกเลิก';
    default:
      return status; // ถ้าสถานะไม่ตรงกับที่กำหนด, ให้แสดงสถานะเดิม
  }
};

const ManageDoce = () => {
  const [rows, setRows] = useState<GridRowsProp<OrderProduct>>([]);

  const [suppliers, setSupplier] = useState<any[]>([]); // To store units
  const [orderproducts, setOrderProduct] = useState<any[]>([]); // To store units
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chefs, setChefs] = useState<any[]>([]);

  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId);
      if (selectedRow) {
        setValue('sender_Name', selectedRow.sender_Name);
        setValue('receiver_Name', selectedRow.receiver_Name);
        setValue('description', selectedRow.description);
        const rawDate = new Date(selectedRow.shipment_Date);
        const formattedDate: any = rawDate.toISOString().split('T')[0]; // ได้รูปแบบ "2025-03-20"

        setValue('shipment_Date', formattedDate);
        setValue('delivery_Status', selectedRow.delivery_Status);
        setValue('supplier_Id', selectedRow.supplier_Id);
        setValue('orderproduct_id', selectedRow.orderproduct_id);

      }
    }
  }, [selectedRowId, rows, setValue]);

  const fetchData = async () => {
    try {
      const orderResponse = await axios.get(`${API_URL}/api/data/getDeliveryNote`);

      setRows(orderResponse.data.deliverynote);
      setSupplier(orderResponse.data.supplier);
      setOrderProduct(orderResponse.data.orderProduct);

      console.log(orderResponse.data)



    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOpenClick = (orderId: string) => {
    setSelectedOrderId(orderId); // เปิด Modal พร้อมส่งค่า
  };
  const handdlecloseDetail = () => {
    setSelectedOrderId(null); // ปิด Modal
  }

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      flex: 0.9,
      minWidth: 30,
      renderCell: (params) => rows.indexOf(params.row) + 1,
    },
    {
      field: 'document_number',
      headerName: 'รหัสออเดอร์',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.row._id,
    },
    {
      field: 'status',
      headerName: 'สถานะรายการ',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => translateStatus(params.row.delivery_Status),
    },
    {
      field: 'sender_Name',
      headerName: 'ผู้ส่ง',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.row?.sender_Name,
    },

    {
      field: 'receiver_Name',
      headerName: 'ผู้รับ',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.row?.receiver_Name,
    },
    {
      field: 'shipment_Date',
      headerName: 'วันที่ส่ง',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const rawDate = params.row.shipment_Date;
        const date = new Date(rawDate);

        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    },
    },
    {
      field: 'description',
      headerName: 'รายละเอียดเพิ่มเติม',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.row?.description,
    },
    {
      field: 'supplier_Id',
      headerName: 'ร้านค้า',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.row?.supplier_Id?.supplier_Name,
    },
    {
      field: 'orderproduct_id',
      headerName: 'รายการที่เชฟสั่ง',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.row?.orderproduct_id?.document_number,
    },
    {
      field: 'details',
      headerName: 'รายละเอียดใบส่งของ',
      minWidth: 150,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<HistoryEdu />} onClick={() => handleOpenClick(params.id.toString())}>
          รายการ
        </Button>
      ),
    },
    {
      field: 'Betaling-staat',
      headerName: 'ใบแจ้งการชำระ',
      minWidth: 120,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleOpenClick(params.id.toString())}>
          เพิ่มเติม
        </Button>
      ),
    },
    {
      field: 'Bevestig-betaling',
      headerName: 'เอกสารยืนยันการชำระ',
      minWidth: 150,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleOpenClick(params.id.toString())}>
          เพิ่มเติม
        </Button>
      ),
    },
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
        const orderId = rows.find((row) => row._id === id)?._id;
        if (orderId) {
          await axios.delete(`${API_URL}/api/data/deleteOrderProduct/${orderId}`);
          const updatedRows = rows.filter((row) => row._id !== orderId);
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

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      if (selectedRowId !== null) {
        const updatedData = {
          sender_Name: data.sender_Name,
          receiver_Name: data.receiver_Name,
          description: data.description,
          shipment_Date: data.shipment_Date,
          delivery_Status: data.delivery_Status,
          supplier_Id: data.supplier_Id,
          orderproduct_id: data.orderproduct_id
        };

        await axios.put(
          `${API_URL}/api/auth/updateemployee/${selectedRowId}`,
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
        const response = await axios.post(`${API_URL}/api/data/postDeliveryNote`, data); // แทนที่ด้วย endpoint ของคุณ
        if (response.status === 200) {
          setRows([...rows, response.data.data]);
          setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>)
        }
      }
      handleClose();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleClose = () => {
    // Close the dialog and reset form
    setOpen(false);
    reset();
  };

  const handleEditClick = (id: GridRowId) => {
    setSelectedRowId(id);
    setOpen(true);
  };

  const handleAddClick = () => {
    // Reset and open the dialog for adding a new drink
    setSelectedRowId(null);
    reset(); // Reset the form values
    setOpen(true);
  };

  return (
    <>
      {
        selectedOrderId ? (
          <div>
            <DoceFaltur id={selectedOrderId} onClose={handdlecloseDetail} />
          </div>
        ) : (
          <div style={{ height: '90vh', width: '80vw' }}>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลการจัดส่ง' : 'เพิ่มข้อมูลการจัดส่ง'}</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="sender_Name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="ชื่อผู้ส่ง"
                        fullWidth
                        margin="dense"
                        error={!!errors.sender_Name}
                        helperText={errors.sender_Name?.message}
                      />
                    )}
                  />
                  <Controller
                    name="receiver_Name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="ชื่อผู้รับ"
                        fullWidth
                        margin="dense"
                        error={!!errors.receiver_Name}
                        helperText={errors.receiver_Name?.message}
                      />
                    )}
                  />
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="รายละเอียด"
                        fullWidth
                        margin="dense"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                  <Controller
                    name="shipment_Date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="วันที่จัดส่ง"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        margin="dense"
                        error={!!errors.shipment_Date}
                        helperText={errors.shipment_Date?.message}
                      />
                    )}
                  />
                  <Controller
                    name="delivery_Status"
                    control={control}
                    // defaultValue="Other"
                    render={({ field }) => (
                      <TextField
                        select
                        // defaultValue="Other"
                        label="สถานะการจัดส่ง"
                        fullWidth
                        margin="dense"
                        error={!!errors.delivery_Status}
                        helperText={errors.delivery_Status?.message}
                        value={field.value || ''} // ✅ ป้องกัน undefined
                        onChange={field.onChange}
                      >
                        <MenuItem value="Pending">รอดำเนินการ</MenuItem>
                        <MenuItem value="In Progress">กำลังดำเนินการ</MenuItem>
                        <MenuItem value="Completed">เสร็จสิ้น</MenuItem>
                        <MenuItem value="Cancelled">ยกเลิก</MenuItem>

                      </TextField>
                    )}
                  />
                  <Controller
                    name="supplier_Id"
                    control={control}
                    rules={{ required: "กรุณาเลือกร้านค้า" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="ร้านค้า"
                        fullWidth
                        margin="dense"
                        error={!!errors.supplier_Id}
                        helperText={errors.supplier_Id?.message}
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

                  <Controller
                    name="orderproduct_id"
                    control={control}
                    rules={{ required: "กรุณาเลือกออรายการที่ต้องซื้อ" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="รายการ"
                        fullWidth
                        margin="dense"
                        error={!!errors.orderproduct_id}
                        helperText={errors.orderproduct_id?.message}
                        value={field.value || ""}
                        onChange={field.onChange}
                      >
                        {orderproducts.map((orderproduct) => (
                          <MenuItem key={orderproduct._id} value={orderproduct._id}>
                            {orderproduct.document_number}
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
        )
      }

    </>
  )
}

export default ManageDoce;
