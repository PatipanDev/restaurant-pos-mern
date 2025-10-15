const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId} from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,  MenuItem, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

import SuccessAlert from '../../../components/AlertSuccess';
import WarningAlert from '../../../components/AlertDivWarn';
import ErrorBoundary from '../../ErrorBoundary';

interface IngredientDetail {
  _id: string;
  IngredientDt_Qua: number;
  ingredient_Id: any; // Assuming ingredient_id is an object with _id and name
  product_Id: any; // Assuming product_id is an object with _id and name
}

interface FormData {
  IngredientDt_Qua: number;
  product_Id: string;
}

interface IngrediendetailsProps {
  id: string;
  name: string;
  onClose: () => void;
}

const schema = yup.object({
  IngredientDt_Qua: yup.number().required('กรุณาใส่ปริมาณ'),
  // IngredientDt_Unit: yup.string().required('กรุณาใส่หน่วย'),
  // ingredient_id: yup.string().required('กรุณาเลือกส่วนผสม'),
  product_Id: yup.string().required('กรุณาเลือกสินค้า'),
}).required();

const Ingrediendetails: React.FC<IngrediendetailsProps> = ({ id, name, onClose }) => {
  const [rows, setRows] = useState<GridRowsProp<IngredientDetail>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {

      const ingredientDetailsResponse = await axios.get(`${API_URL}/api/data/getIngredientDetails/${id}`);
      setRows(ingredientDetailsResponse.data.ingredientDetails);
      setProducts(ingredientDetailsResponse.data.product)




      console.log('Ingredient Details:', ingredientDetailsResponse.data);
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
        setValue('IngredientDt_Qua', selectedRow.IngredientDt_Qua);
        setValue('product_Id', selectedRow.product_Id._id);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef[] = [
    { field: 'index', headerName: 'ลำดับ', flex: 0.9, width: 30, renderCell: (params) => rows.indexOf(params.row) + 1 },
    { field: 'product_id', headerName: 'สินค้า', flex: 1, minWidth: 180, renderCell: (params) => params.row.product_Id?.product_Name },
    { field: 'IngredientDt_Qua', headerName: 'ปริมาณ', flex: 1, minWidth: 100 },
    { field: 'product_Quantity', headerName: 'ปริมาณวัตถุดิบที่เตรียมทั้งหมด', flex: 1, minWidth: 100, renderCell: (params) => params.row.product_Id?.product_Quantity },
    { field: 'product_Stock', headerName: 'ปริมาณวัตถุดิบคงเหลือ', flex: 1, minWidth: 100, renderCell: (params) => params.row.product_Id?.product_Stock },
    { field: 'product_unit', headerName: 'หน่วย', flex: 1, minWidth: 100, renderCell: (params) => params.row.product_Id?.unitId?.unit_Name },
    {
      field: 'actions',
      headerName: 'แก้ไขข้อมูล',
      width: 100,
      renderCell: (params) => {
        const isDisabled = !params.row.product_Id?.product_Name;
    
        return (
          <Button
            variant="outlined"
            startIcon={<ModeEditIcon />}
            onClick={() => handleEditIngredientClick(params.id as string)}
            disabled={isDisabled} // ปิดการใช้งานถ้าค่าหนึ่งใดว่าง
          >
            แก้ไข
          </Button>
        );
      },
    },
    {
      field: 'delete',
      headerName: 'ลบข้อมูล',
      width: 100,
      renderCell: (params) => (
        <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteIngredientClick(params.id as string)}>
          ลบ
        </Button>
      ),
    },
  ];

  const handleEditIngredientClick = (id: string) => {
    const ingredientDetail = rows.find((row) => row._id === id);
    if (ingredientDetail) {
      setValue('IngredientDt_Qua', ingredientDetail.IngredientDt_Qua);
      setValue('product_Id', ingredientDetail.product_Id._id);
      setSelectedRowId(id);
      setOpen(true);
    }
  };

  const handleDeleteIngredientClick = async (id: GridRowId) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
    if (confirmDelete) {
      try {
        const ingredientDetailId = rows.find((row) => row._id === id)?._id;
        if (ingredientDetailId) {
          // Call the delete API with the ingredientDetailId
          await axios.delete(`${API_URL}/api/data/deleteIngredientDetail/${ingredientDetailId}`);

          // Filter out the deleted row from the state
          // const updatedRows = rows.filter((row) => row._id !== ingredientDetailId);
          // setRows(updatedRows);
          fetchData();

          setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
        } else {
          alert('ไม่พบข้อมูลที่จะลบ');
        }
      } catch (error: any) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        setAlertMessage(<div>{error.response.data.message}</div>);
      }
    } else {
      // User cancelled deletion
    }
  };


  const handleAddClick = () => {
    // Reset and open the dialog for adding a new product
    setSelectedRowId(null);
    reset(); // Reset the form values
    setOpen(true);
  };

  const handleClose = () => {
    // Close the dialog and reset form
    setOpen(false);
    reset();
  };

  // On form submission, either create a new product or update an existing one
  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      if (selectedRowId !== null) {
        // Update an existing product
        const updatedData = {
          IngredientDt_Qua: data.IngredientDt_Qua,
          ingredient_Id: id, // Assuming `id` is available and valid
          product_Id: data.product_Id,
        };
        console.log("ทดสอบ", updatedData)

        // Correct the URL and data for update
        await axios
          .put(`${API_URL}/api/data/updateIngredientDetail/${selectedRowId}`, updatedData) // Correct URL format
          .then((response) => {
            console.log("Update successful", response.data);
            fetchData();
            setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);

            // Update the rows in the state with the new data
          })
          .catch((error: any) => {
            console.error("Error updating data:", error);
            setAlertMessage(<div>{error.response.data.message}</div>);
          });
      } else {
        const newData = {
          IngredientDt_Qua: data.IngredientDt_Qua,
          ingredient_Id: id, // Assuming `id` is available and valid for adding
          product_Id: data.product_Id,
        };

        const response = await axios.post(
          `${API_URL}/api/data/addIngredientDetail`, // Correct URL for adding a new ingredient detail
          newData
        );
        if(response.status === 200){
          console.log(response.data)
          fetchData();
          setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);

        }   
      }
      handleClose(); // Close the form dialog
    } catch (error: any) {
      console.error("Error submitting data:", error);
      setAlertMessage(<div>{error.response.data.message}</div>);
    }
  };


  return (
    <div style={{ height: '90vh', width: '100%', marginBottom: 70 }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขรายละเอียดส่วนผสม' : 'เพิ่มรายละเอียดส่วนผสม'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
           

            <Controller
              name="product_Id"
              control={control}
              rules={{ required: "กรุณาเลือกสินค้า" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="สินค้า"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Id}
                  helperText={errors.product_Id?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                      <MenuItem key={product._id} value={product._id}>
                        {product?.product_Name} คงเหลือ {product.product_Stock} {product?.unitId?.unit_Name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      กรุณาเพิ่มข้อมูล product ก่อน
                    </MenuItem>
                  )}
                </TextField>
              )}
            />
             <Controller
              name="IngredientDt_Qua"
              control={control}
              rules={{ required: "กรุณากรอกปริมาณ" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`ปริมาณ` }
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.IngredientDt_Qua}
                  helperText={errors.IngredientDt_Qua?.message}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                  value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
        <Button color="primary">{name}</Button>
        <Button onClick={onClose} variant="contained" startIcon={<CloseIcon />}>
          ปิดหน้ารายละเอียด
        </Button>
        <Button variant="contained" onClick={handleAddClick}>
          เพิ่มข้อมูล
        </Button>

        <WarningAlert messagealert={alertMessage} />
        <SuccessAlert successalert={alertSuccess} />
      </div>

    </div>
  );
}

export default Ingrediendetails;
