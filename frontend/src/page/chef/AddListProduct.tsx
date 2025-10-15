const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,  MenuItem} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import * as yup from 'yup';
import axios from 'axios';


import SuccessAlert from '../../components/AlertSuccess';
import WarningAlert from '../../components/AlertDivWarn';
import ErrorBoundary from '../ErrorBoundary';

interface OrderProductDetail {
    _id: string;
    order_Quantity: number;
    order_Detail: string | undefined;
    product_Id: any;
    orderproduct_Id: any;
}

interface FormData {
    order_Quantity: number;
    order_Detail?: string | undefined;
    product_Id: string;
}

interface OrderProductDetailsProps {
    id: string; // OrderProduct ID
    onClose: () => void;
}

const schema = yup.object({
    order_Quantity: yup.number().required('กรุณาใส่จำนวนสินค้า').min(1, 'จำนวนต้องมากกว่า 0'),
    order_Detail: yup.string().max(255, 'ต้องไม่เกิน 255 ตัวอักษร'),
    product_Id: yup.string().required('กรุณาเลือกสินค้า'),
}).required();

const AddListProductDetail: React.FC<OrderProductDetailsProps> = ({ id, onClose }) => {
    const [rows, setRows] = useState<GridRowsProp<OrderProductDetail>>([]);
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
            const orderDetailResponse = await axios.get(`${API_URL}/api/data/getOrderProductDetail/${id}`);
            setRows(orderDetailResponse.data.orderProductDetail);
            setProducts(orderDetailResponse.data.product)

            console.log('Order Product Details:', orderDetailResponse.data.product);
            console.log('Order Product ID:', orderDetailResponse.data);
        } catch (error: any) {
            console.error('Error fetching data:', error),
                setProducts(error.response.data.product)
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        if (selectedRowId !== null) {
            const selectedRow = rows.find((row) => row._id === selectedRowId);
            if (selectedRow) {
                setValue('order_Quantity', selectedRow.order_Quantity);
                setValue('order_Detail', selectedRow.order_Detail || '');
                setValue('product_Id', selectedRow.product_Id._id);
            }
        }
    }, [selectedRowId, rows, setValue]);



    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: 'ลำดับ',
            flex: 0.9,
            minWidth: 30,
            renderCell: (params) => rows.indexOf(params.row) + 1,
        },
        { field: 'product_Id', headerName: 'สินค้า', flex: 1, minWidth: 180, renderCell: (params) => params.row?.product_Id?.product_Name },
        { field: 'recipes_Quantity', headerName: 'ปริมาณ', flex: 1, minWidth: 100, renderCell: (params) => params.row?.order_Quantity },
        { field: 'recipes_Detail', headerName: 'รายละเอียด', flex: 1, minWidth: 100, renderCell: (params) => params.row.order_Detail }, // เพิ่มคอลัมน์ราคา
        {
            field: 'actions',
            headerName: 'แก้ไขข้อมูล',
            width: 100,
            renderCell: (params) => {
                const isDisabled = !params.row?.product_Id?.product_Name;
            
                return (
                  <Button
                    variant="outlined"
                    startIcon={<ModeEditIcon />}
                    onClick={() => handleEditFoodRecipeClick(params.id as string)}
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
                <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteFoodRecipeClick(params.id as string)}>
                    ลบ
                </Button>
            ),
        },
    ];

    const handleAddClick = () => {
        setSelectedRowId(null);
        reset();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const handleEditFoodRecipeClick = (id: string) => {
        const OrderProduct = rows.find((row) => row._id === id) as FormData;
        if (OrderProduct) {
            setValue('order_Quantity', OrderProduct.order_Quantity);
            setValue('order_Detail', OrderProduct.order_Detail);
            setValue('product_Id', OrderProduct.product_Id || "");
            setSelectedRowId(id);
            setOpen(true);
        }
    };

    const handleDeleteFoodRecipeClick = async (id: GridRowId) => {
        const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
        if (confirmDelete) {
            try {
                const foodRecipeId = rows.find((row) => row._id === id)?._id;
                if (foodRecipeId) {
                    await axios.delete(`${API_URL}/api/data/deleteOrderProductDetail/${foodRecipeId}`);

                    const updatedRows = rows.filter((row) => row._id !== foodRecipeId);
                    setRows(updatedRows);

                    setAlertSuccess(<div>ลบข้อมูลสำเร็จ</div>);
                } else {
                    alert('ไม่พบข้อมูลที่จะลบ');
                }
            } catch (error: any) {
                console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
                setAlertMessage(<div>{error.response.data.message}</div>);
            }
        }
    };



    const onSubmit = async (data: FormData) => {
        console.log('Form Data:', data);

        try {
            if (selectedRowId !== null) {
                const updatedData = {
                    order_Quantity: data.order_Quantity,
                    order_Detail: data.order_Detail,
                    product_Id: data.product_Id,
                    orderproduct_Id: id
                };

                await axios
                    .put(`${API_URL}/api/data/updateOrderProductDetails/${selectedRowId}`, updatedData)
                    .then((response) => {
                        console.log('Update successful', response.data);
                        fetchData();
                        setAlertSuccess(<div>อัปเดตข้อมูลสำเร็จ</div>);
                    })
                    .catch((error: any) => {
                        console.error('Error updating data:', error);
                        setAlertMessage(<div>{error.response.data.message}</div>);
                    });
            } else {
                const addData = {
                    order_Quantity: data.order_Quantity,
                    order_Detail: data.order_Detail,
                    product_Id: data.product_Id,
                    orderproduct_Id: id
                };

                const response = await axios.post(
                    `${API_URL}/api/data/createOrderProductDetails`,
                    addData
                );

                if (response.status === 200) {
                    fetchData();
                    setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
                } else {
                    setAlertMessage(<div>เกิดข้อผิดพลาดในการเพิ่มข้อมูล</div>)
                }
            }
            handleClose();
        } catch (error: any) {
            console.error('Error submitting data:', error);
            setAlertMessage(<div>{error.response.data.message}</div>);
        }
    };

    return (
        <div style={{ height: '90vh', width: '80vw' }}>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>เพิ่ม/แก้ไขรายละเอียดออเดอร์</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="product_Id"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="สินค้า"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.product_Id}
                                    helperText={errors.product_Id?.message}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                >
                                    {products.map((product) => (
                                        <MenuItem key={product?._id} value={product?._id}>
                                            {product.product_Name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            )}
                        />
                        <Controller
                            name="order_Quantity"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="จำนวนสินค้า" type="number" error={!!errors.order_Quantity} helperText={errors.order_Quantity?.message}
                                    fullWidth
                                    margin="dense" />
                            )}
                        />
                        <Controller
                            name="order_Detail"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="รายละเอียดเพิ่มเติม" multiline error={!!errors.order_Detail} helperText={errors.order_Detail?.message}
                                    fullWidth
                                    margin="dense"
                                />
                            )}
                        />

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} color="error">
                        ยกเลิก
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} color="success">
                        {selectedRowId ? 'อัปเดต' : 'เพิ่ม'}
                    </Button>
                </DialogActions>
            </Dialog>
            <ErrorBoundary>
                <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
            </ErrorBoundary>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
                {/* <Button color="primary">{name}</Button> */}
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
};

export default AddListProductDetail;
