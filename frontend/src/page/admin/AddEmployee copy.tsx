import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Row {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface FormData {
  name: string;
  age: number;
  email: string;
}

const schema = yup.object({
  name: yup.string().required('กรุณาใส่ชื่อ'),
  age: yup.number().required('กรุณาใส่อายุ').positive('อายุต้องเป็นค่าบวก'),
  email: yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณาใส่อีเมล'),
}).required();

const DataGridEditcoppy: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Row>>([
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  ]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedRowId !== null) {
      const selectedRow = rows.find((row) => row.id === selectedRowId) as Row;
      setValue('name', selectedRow.name);
      setValue('age', selectedRow.age);
      setValue('email', selectedRow.email);
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef<Row>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'ชื่อ', width: 150 },
    { field: 'age', headerName: 'อายุ', width: 110 },
    { field: 'email', headerName: 'อีเมล', width: 200 },
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

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: FormData) => {
    if (selectedRowId !== null) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedRowId ? { ...row, ...data } : row
        )
      );
    }
    handleClose();
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>แก้ไขข้อมูล</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="ชื่อ" margin="normal" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              )}
            />
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="อายุ" type="number" margin="normal" fullWidth error={!!errors.age} helperText={errors.age?.message} />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="อีเมล" margin="normal" fullWidth error={!!errors.email} helperText={errors.email?.message} />
              )}
            />
            <DialogActions>
              <Button onClick={handleClose}>ยกเลิก</Button>
              <Button type="submit" color="primary">บันทึก</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataGridEditcoppy;