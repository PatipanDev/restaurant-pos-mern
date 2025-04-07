const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { HistoryEdu } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ObjectId } from 'mongodb';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';

import ManageFoodRecipe from './ManageFoodrecipe';

interface Food {
  _id: string;
  food_Name: string;
  food_Stock: number;
  food_Price: number;
  product_Category_Id: any; // Reference to ProductCategory Model
  chef_Id: string;
  owner_Id: string;
}

interface FormData {
  food_Name: string;
  food_Stock: number;
  food_Price: number;
  product_Category_Id: string;
}

const schema = yup.object({
  food_Name: yup.string().required('กรุณาใส่ชื่ออาหาร').max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  food_Stock: yup.number().required('กรุณาใส่จำนวนคงเหลือ').min(0, 'จำนวนคงเหลือไม่สามารถน้อยกว่า 0 ได้'),
  food_Price: yup.number().required('กรุณาใส่ราคา').min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  product_Category_Id: yup.string().required('กรุณาเลือกประเภทอาหาร'),
}).required();

const ManageFoodsChef: React.FC = () => {
  const [rows, setRows] = useState<GridRowsProp<Food>>([]);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
  const [selectedFood, setselectedFood] = useState<{ id: string; name: string } | null>(null); //เก็บค่าไอดีกับชื่อเพื่อส่งไปที่คอมโพเนน
  const [showModal, setShowModal] = useState(false); // โชว์หน้ารายละเอียด       


  const [categories, setCategories] = useState<any[]>([]); // To store categories
  const [chefs, setChefs] = useState<any[]>([]); // To store chefs
  const [owners, setOwners] = useState<any[]>([]); // To store owners
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
      const foodsResponse = await axios.get(`${API_URL}/api/food/getfoods`);
      setRows(foodsResponse.data);

      const categoriesResponse = await axios.get(`${API_URL}/api/data/getfoodcategory`);
      setCategories(categoriesResponse.data);

      const chefResponse = await axios.get(`${API_URL}/api/auth/getChefs`);
      setChefs(chefResponse.data);

      console.log('Foods:', foodsResponse.data);
      console.log('Categories:', categoriesResponse.data);
      console.log('chef:', chefResponse.data);
      console.log('owner:', chefResponse.data);



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
        setValue('food_Name', selectedRow.food_Name);
        setValue('food_Stock', selectedRow.food_Stock);
        setValue('food_Price', selectedRow.food_Price);
        setValue('product_Category_Id', selectedRow.product_Category_Id._id);
      }
    }
  }, [selectedRowId, rows, setValue]);

  const columns: GridColDef[] = [
    {
        field: 'index',
        headerName: 'ลำดับ',
        flex: 0.9,
        width: 30,
        renderCell: (params) => rows.indexOf(params.row) + 1,
        align: 'center',  // ข้อความชิดขวา
    },
    { 
        field: 'food_Name', 
        headerName: 'ชื่ออาหาร', 
        flex: 1, 
        minWidth: 180,
        align: 'left', // ข้อความชิดขวา
    },
    { 
        field: 'food_Stock', 
        headerName: 'จำนวนคงเหลือ', 
        flex: 1, 
        minWidth: 100,
        align: 'right', // ข้อความชิดขวา
    },
    { 
        field: 'food_Price', 
        headerName: 'ราคาอาหาร', 
        flex: 1, 
        minWidth: 120,
        align: 'right', // ข้อความชิดขวา
    },
    {
        field: 'product_Category',
        headerName: 'ประเภทอาหาร',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => params.row.product_Category_Id?.category_name,
        align: 'right', // ข้อความชิดขวา
    },
    {
        field: 'chef_Id',
        headerName: 'เชฟ',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => params.row.chef_Id?.chef_Name,
        align: 'right', // ข้อความชิดขวา
    },
    {
        field: 'owner_Id',
        headerName: 'เจ้าของร้าน',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => params.row.owner_Id?.owner_Name,
        align: 'left', // ข้อความชิดขวา
    },
    {
        field: 'details',
        headerName: 'รายละเอียดสูตรอาหาร',
        minWidth: 150,
        renderCell: (params) => (
            <Button variant="outlined" startIcon={<HistoryEdu />} onClick={() => handleShowFoodrecipeClick(params.id, params.row.food_Name)}>
                รายละเอียด
            </Button>
        ),
        align: 'right', // ข้อความชิดขวา
    },
    {
        field: 'actions',
        headerName: 'แก้ไขข้อมูล',
        width: 100,
        renderCell: (params) => (
            <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditClick(params.id)}>
                แก้ไข
            </Button>
        ),
        align: 'right', // ข้อความชิดขวา
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
        align: 'right', // ข้อความชิดขวา
    },
];


  const handleDeleteClick = async (id: GridRowId) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
    if (confirmDelete) {
      try {
        const foodId = rows.find((row) => row._id === id)?._id;
        if (foodId) {
          await axios.delete(`${API_URL}/api/data/updatefoods/${foodId}`);
          const updatedRows = rows.filter((row) => row._id !== foodId);
          setRows(updatedRows);
          setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
        } else {
          alert('ไม่พบข้อมูลที่จะลบ');
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        setAlertMessage(<div>เกิดข้อผิดพลาดในการลบข้อมูล</div>);
      }
    } else {
      // User cancelled deletion
    }
  };

  const handleShowFoodrecipeClick = (id: GridRowId, name: GridRowId) => {
    setselectedFood({ id: String(id), name: String(name) });
    setShowModal(true);
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);
    console.log(user._id)


    try {
      // ตรวจสอบว่า user มีข้อมูลและ role ที่ถูกต้อง
      if (!user._id || !user.role) {
        setAlertMessage(<div>ไม่พบข้อมูลผู้ใช้หรือผู้ใช้ไม่ได้ล็อกอิน</div>);
        return;
      }

      // สร้างข้อมูลที่จะส่งไปยัง API
      let updatedData: any = {
        food_Name: data.food_Name,
        food_Stock: data.food_Stock,
        food_Price: data.food_Price,
        product_Category_Id: data.product_Category_Id,
      };

      if (user.role === "chef") {
        updatedData.chef_Id = user._id; // ถ้าผู้ใช้เป็น chef ให้ใช้ chef_Id
        updatedData.owner_Id = null; // ให้ owner_Id เป็นค่าว่าง
      } else if (user.role === "owner") {
        updatedData.owner_Id = user._id; // ถ้าผู้ใช้เป็น owner ให้ใช้ owner_Id
        updatedData.chef_Id = null; // ให้ chef_Id เป็นค่าว่าง
      }

      console.log("Updated Data:", updatedData);

      // ถ้ามี selectedRowId หมายถึงการอัปเดตข้อมูล
      if (selectedRowId !== null) {
        await axios
          .put(`${API_URL}/api/data/updatefoods/${selectedRowId}`, updatedData)
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
        console.log(updatedData)
        // ถ้าไม่มี selectedRowId หมายถึงการเพิ่มข้อมูลใหม่
        const response = await axios.post(
          `${API_URL}/api/data/postfoods`,
          updatedData
        );

        setRows([...rows, response.data]);
        fetchData();
        setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
      }

      handleClose();
    } catch (error: any) {
      console.error("Error submitting data:", error);
      setAlertMessage(<div>{error.response.data.message}</div>);
    }
  };

  return (
    <div style={{ height: '90vh', width: '80vw' }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลอาหาร' : 'เพิ่มข้อมูลอาหาร'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="food_Name"
              control={control}
              rules={{ required: "กรุณากรอกชื่ออาหาร" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่ออาหาร"
                  fullWidth
                  margin="dense"
                  error={!!errors.food_Name}
                  helperText={errors.food_Name?.message}
                />
              )}
            />

            <Controller
              name="food_Stock"
              control={control}
              rules={{ required: "กรุณากรอกจำนวนคงเหลือ" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="จำนวนคงเหลือ"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.food_Stock}
                  helperText={errors.food_Stock?.message}
                />
              )}
            />

            <Controller
              name="food_Price"
              control={control}
              rules={{ required: "กรุณากรอกราคา" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ราคาอาหาร"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={!!errors.food_Price}
                  helperText={errors.food_Price?.message}
                />
              )}
            />

            <Controller
              name="product_Category_Id"
              control={control}
              rules={{ required: "กรุณาเลือกประเภทอาหาร" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="ประเภทอาหาร"
                  fullWidth
                  margin="dense"
                  error={!!errors.product_Category_Id}
                  helperText={errors.product_Category_Id?.message}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.category_name}
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

          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error">ยกเลิก</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)} color="success">
            {selectedRowId ? 'อัปเดต' : 'เพิ่ม'}
          </Button>
        </DialogActions>
      </Dialog>
      {showModal && selectedFood && (
        <ManageFoodRecipe
          key={selectedFood.id} // ใช้ `key` เพื่อให้ component รีเฟรชใหม่ทุกครั้ง
          id={selectedFood.id}
          name={selectedFood.name}
          onClose={() => setShowModal(false)}
        />
      )}


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

export default ManageFoodsChef;  