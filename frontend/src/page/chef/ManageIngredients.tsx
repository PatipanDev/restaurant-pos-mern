const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect, Component } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId, GridCellParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
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
import { ListAlt } from '@mui/icons-material';

// Component
import Ingrediendetails from './componentchef/Ingrediendetails';

interface Ingredient {
    _id: string;
    ingredient_Quantity: number;
    ingredient_Name: string;
    ingredient_Steps: string;
    ingredient_Exdate: Date;
    chef_Id: string; // Reference to Chef Model
}

interface FormData {
    ingredient_Quantity: number;
    ingredient_Name: string;
    ingredient_Steps: string;
    ingredient_Exdate: Date;
    // chef_Id: string;
}

const schema = yup.object({
    ingredient_Quantity: yup.number().required('กรุณาใส่ปริมาณส่วนผสม').min(0, 'ปริมาณส่วนผสมไม่สามารถน้อยกว่า 0 ได้'),
    ingredient_Name: yup.string().required('กรุณาใส่ชื่อส่วนผสม').max(255, 'ชื่อต้องไม่เกิน 255 ตัวอักษร'),
    ingredient_Steps: yup.string().required('กรุณาใส่ขั้นตอนการเตรียม'),
    ingredient_Exdate: yup.date().required('กรุณาใส่วันหมดอายุ'),
    // chef_Id: yup.string().required('กรุณาเลือกเชฟ'),
}).required();

const ManageIngredients: React.FC = () => {
    const [rows, setRows] = useState<GridRowsProp<Ingredient>>([]);
    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false); // โชว์หน้ารายละเอียด       
    const [selectedIngredient, setSelectedIngredient] = useState<{ id: string; name: string } | null>(null); //ส่งค่า ไอดีกับชื่อไป
    const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
    const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
    const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);

    const [chefs, setChefs] = useState<any[]>([]); // To store chefs

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ingredientsResponse = await axios.get(`${API_URL}/api/data/getingredients`);
                setRows(ingredientsResponse.data);

                const chefsResponse = await axios.get(`${API_URL}/api/auth/getChefs`);
                setChefs(chefsResponse.data);

                console.log('Ingredients:', ingredientsResponse.data);
                console.log('Chefs:', chefsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        if (selectedRowId !== null) {
            const selectedRow = rows.find((row) => row._id === selectedRowId);
            if (selectedRow) {
                setValue('ingredient_Name', selectedRow.ingredient_Name);
                setValue('ingredient_Quantity', selectedRow.ingredient_Quantity);
                setValue('ingredient_Steps', selectedRow.ingredient_Steps);
                const rawDate = new Date(selectedRow.ingredient_Exdate);
                const formattedDate: any = rawDate.toISOString().split('T')[0]; // ได้รูปแบบ "2025-03-20"

                setValue('ingredient_Exdate', formattedDate);

            }
        }
    }, [selectedRowId, rows, setValue]);

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: 'ลำดับ',
            flex: 1,
            minWidth: 110,
            renderCell: (params) => rows.indexOf(params.row) + 1,
        },
        { field: 'ingredient_Name', headerName: 'ชื่อการเตรียม', flex: 1, minWidth: 180 },
        { field: 'ingredient_Quantity', headerName: 'ปริมาณ(กิโลกรัม)', flex: 1, minWidth: 100 },
        { field: 'ingredient_Steps', headerName: 'ขั้นตอนการเตรียม รายละเอียด', flex: 1, minWidth: 200 },
        {
            field: 'ingredient_Exdate',
            headerName: 'วันหมดอายุ',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
                const rawDate = params.row.ingredient_Exdate;
                const date = new Date(rawDate);

                return date.toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            },
        },
        {
            field: 'chef_Id',
            headerName: 'เชฟที่ทำการเตรียม',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => params.row.chef_Id?.chef_Name, // Render chef name instead of ID
        },
        {
            field: 'details',
            headerName: 'รายละเอียดที่เตรียม',
            minWidth: 150,
            renderCell: (params) => (
                <Button variant="outlined" startIcon={<ListAlt />} onClick={() => handleShowIngredientClick(params.id, params.row.ingredient_Name)}>
                    รายละเอียด
                </Button>
            ),
        },
        {
            field: 'actions',
            headerName: 'แก้ไขข้อมูล',
            width: 100,
            renderCell: (params) => (
                <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditIngredientClick(params.id)}>
                    แก้ไข
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: 'ลบข้อมูล',
            width: 100,
            renderCell: (params) => (
                <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteIngredientClick(params.id)}>
                    ลบ
                </Button>
            ),
        },
    ]

    const handleDeleteIngredientClick = async (id: GridRowId) => {
        const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลส่วนผสมนี้?');
        if (confirmDelete) {
            try {
                const ingredientId = rows.find((row) => row._id === id)?._id;
                if (ingredientId) {
                    await axios.delete(`${API_URL}/api/data/deleteingredients/${ingredientId}`);

                    const updatedRows = rows.filter((row) => row._id !== ingredientId);
                    setRows(updatedRows);

                    setAlertSuccess(<div>ลบข้อมูลส่วนผสมสำเร็จ</div>);
                } else {
                    alert('ไม่พบข้อมูลส่วนผสมที่จะลบ');
                }
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการลบข้อมูลส่วนผสม:', error);
                setAlertMessage(<div>เกิดข้อผิดพลาดในการลบข้อมูลส่วนผสม</div>);
            }
        } else {
            // User cancelled deletion
        }
    };

    const handleShowIngredientClick = (id: GridRowId, name: GridRowId) => {
        setSelectedIngredient({ id: String(id), name: String(name) });
        setShowModal(true);
    };

    const handleEditIngredientClick = (id: GridRowId) => {
        setSelectedRowId(id);
        setOpen(true);
    };

    const handleAddIngredientClick = () => {
        setSelectedRowId(null);
        reset();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const handleSubmitIngredient = async (data: FormData) => {
        console.log("Form Data:", data);

        try {
            // ดึง user จาก localStorage
            const userData = localStorage.getItem("user");
            let userId = null;

            if (userData) {
                const user = JSON.parse(userData);
                userId = user._id;
            }

            if (!userId) {
                setAlertMessage(<div>ไม่สามารถระบุข้อมูลผู้ใช้ได้</div>);
                return;
            }

            const ingredientData = {
                ingredient_Name: data.ingredient_Name,
                ingredient_Quantity: data.ingredient_Quantity,
                ingredient_Steps: data.ingredient_Steps,
                ingredient_Exdate: data.ingredient_Exdate,
                chef_Id: userId, // กำหนดจาก user._id โดยอัตโนมัติ
            };

            if (selectedRowId !== null) {
                // อัปเดตข้อมูล
                await axios
                    .put(`${API_URL}/api/data/updateingredients/${selectedRowId}`, ingredientData)
                    .then((response) => {
                        console.log("Update successful", response.data);
                        setAlertSuccess(<div>อัปเดตข้อมูลส่วนผสมสำเร็จ</div>);

                        const updatedRows = rows.map((row) =>
                            row._id === selectedRowId ? { ...row, ...ingredientData } : row
                        );
                        setRows(updatedRows);
                    })
                    .catch((error) => {
                        console.error("Error updating data:", error);
                        setAlertMessage(<div>เกิดข้อผิดพลาดในการอัปเดตข้อมูลส่วนผสม</div>);
                    });
            } else {
                // เพิ่มข้อมูลใหม่
                const response = await axios.post(
                    `${API_URL}/api/data/createingredients/`,
                    ingredientData
                );

                setRows([...rows, response.data]);
                setAlertSuccess(<div>เพิ่มข้อมูลส่วนผสมสำเร็จ</div>);
            }

            handleClose();
        } catch (error) {
            console.error("Error submitting data:", error);
            setAlertMessage(<div>เกิดข้อผิดพลาดในการดำเนินการ</div>);
        }
    };



    return (
        <div style={{ height: '90vh', width: '80vw' }}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{selectedRowId ? 'แก้ไขข้อมูลส่วนผสม' : 'เพิ่มข้อมูลส่วนผสม'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(handleSubmitIngredient)}>
                        <Controller
                            name="ingredient_Name"
                            control={control}
                            rules={{ required: "กรุณากรอกชื่อส่วนผสม" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ชื่อการเตรียมวัตถุดิบ"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.ingredient_Name}
                                    helperText={errors.ingredient_Name?.message}
                                />
                            )}
                        />
                        {/* ปรับให้ค่าเริ่มต้นที่ 0 */}
                        <Controller
                            name="ingredient_Quantity"
                            control={control}
                            rules={{ required: "กรุณากรอกปริมาณ" }}
                            defaultValue={0} // กำหนดค่าเริ่มต้นเป็น 0
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ปริมาณ"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.ingredient_Quantity}
                                    helperText={errors.ingredient_Quantity?.message}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                                    value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
                                />
                            )}
                        />

                        <Controller
                            name="ingredient_Steps"
                            control={control}
                            rules={{ required: "กรุณากรอกขั้นตอนการเตรียม" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="รายละเอียด ขั้นตอนการเตรียม"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.ingredient_Steps}
                                    helperText={errors.ingredient_Steps?.message}
                                    multiline // Add multiline property for steps
                                    rows={4} // Adjust rows as needed
                                />
                            )}
                        />

                        <Controller
                            name="ingredient_Exdate"
                            control={control}
                            rules={{ required: "กรุณากรอกวันหมดอายุ" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="วันหมดอายุ"
                                    type="date"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.ingredient_Exdate}
                                    helperText={errors.ingredient_Exdate?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} color="error">ยกเลิก</Button>
                    <Button variant="contained" onClick={handleSubmit(handleSubmitIngredient)} color="success">
                        {selectedRowId ? 'อัปเดต' : 'เพิ่ม'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <Ingrediendetails/> */}
            {showModal && selectedIngredient && (
                <Ingrediendetails
                    key={selectedIngredient.id}
                    id={selectedIngredient.id}
                    name={selectedIngredient.name}
                    onClose={() => setShowModal(false)}
                />
            )}

            <ErrorBoundary>
                <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
            </ErrorBoundary>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button variant="contained" onClick={handleAddIngredientClick}>เพิ่มข้อมูล</Button>
                <WarningAlert messagealert={alertMessage} />
                <SuccessAlert successalert={alertSuccess} />
            </div>
        </div>
    );
};

export default ManageIngredients;