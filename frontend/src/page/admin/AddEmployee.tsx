import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

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
  const [rows, setRows] = useState<GridRowsProp<Employee>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/getemployees'); // แทนที่ด้วย endpoint ของคุณ
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row._id === selectedRowId) as Employee;
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
    { field: '_id', headerName: 'ID', width: 100 },
    { field: 'employee_Name', headerName: 'ชื่อ', width: 150 },
    { field: 'employee_Citizen_id', headerName: 'เลขบัตรประชาชน', width: 150 },
    { field: 'employee_Weight', headerName: 'น้ำหนัก', width: 100 },
    { field: 'employee_Height', headerName: 'ส่วนสูง', width: 100 },
    { field: 'employee_Address', headerName: 'ที่อยู่', width: 200 },
    { field: 'employee_Details', headerName: 'รายละเอียด', width: 200 },
    { field: 'employee_Birthday', headerName: 'วันเกิด', width: 200 },

    {
      field: 'actions',
      headerName: 'การกระทำ',
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleEditClick(params.id)}>แก้ไข</Button>
      ),
    },
  ];

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
        // แก้ไขข้อมูล
        await axios.put(`http://localhost:3000/api/auth/login${selectedRowId}`, data); // แทนที่ด้วย endpoint ของคุณ
        const updatedRows = rows.map((row) =>
          row._id === selectedRowId ? { ...row, ...data } : row
        );
        setRows(updatedRows);
      } else {
        // เพิ่มข้อมูลใหม่
        const response = await axios.post('http://localhost:3000/api/auth/login', data); // แทนที่ด้วย endpoint ของคุณ
        setRows([...rows, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Button onClick={handleAddClick}>เพิ่มข้อมูล</Button>
      <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      {/* ... (Dialog) */}
    </div>
  );
};

export default DataGridEdit;