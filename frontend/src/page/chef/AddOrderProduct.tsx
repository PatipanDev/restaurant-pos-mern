const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { HistoryEdu } from '@mui/icons-material';


import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import AddListProductDetail from './AddListProduct';
import ErrorBoundary from '../ErrorBoundary';

interface OrderProduct {
  _id: string;
  chef_Id: { chef_name: string };
}


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

const AddListFoodBuy = () => {
  const [rows, setRows] = useState<GridRowsProp<OrderProduct>>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chefs, setChefs] = useState<any[]>([]);

  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const orderResponse = await axios.get(`${API_URL}/api/data/getOrderProduct`);
      setRows(orderResponse.data);
      console.log(orderResponse.data)

      const chefResponse = await axios.get(`${API_URL}/api/auth/getChefs`);
      setChefs(chefResponse.data);

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
      minWidth: 180,
      renderCell: (params) => params.row.document_number,
    },
    {
      field: 'order_status',
      headerName: 'สถานะรายการ',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => translateStatus(params.row.order_Status),
    },
    {
      field: 'chef_Id',
      headerName: 'เชฟ',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row?.chef_Id?.chef_Name || "ยังไม่ได้เพิ่มรายการ",
    },
    {
      field: 'details',
      headerName: 'รายละเอียดรายการ',
      minWidth: 150,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<HistoryEdu />} onClick={() => handleOpenClick(params.id.toString())}>
          รายละเอียด
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

  const handlecreateOrderProduct = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      if (!user._id || !user.role) {
        setAlertMessage(<div>ไม่พบข้อมูลผู้ใช้หรือผู้ใช้ไม่ได้ล็อกอิน</div>);
        return;
      }

      if (user.role === "chef") {
        const chef_Id = user._id
        console.log(chef_Id)
        const response = await axios.post(`${API_URL}/api/data/createOrderProduct`, { chef_Id });
        fetchData();
        setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
      }
    } catch (error: any) {
      console.error("Error submitting data:", error);
      setAlertMessage(<div>{error.response.data.message}</div>);
    }
  };



  return (
    <>
      {
        selectedOrderId ? (
          <div>
            <AddListProductDetail id={selectedOrderId} onClose={handdlecloseDetail}/>
          </div>
        ) : (
          <div style={{ height: '90vh', width: '80vw' }}>
            <ErrorBoundary>
              <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
            </ErrorBoundary>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <Button variant="contained" onClick={() => handlecreateOrderProduct()}>สร้างรายการสั่งสินค้า</Button>
              <WarningAlert messagealert={alertMessage} />
              <SuccessAlert successalert={alertSuccess} />
            </div>
          </div>
        )
      }

    </>
  )
}

export default AddListFoodBuy;
