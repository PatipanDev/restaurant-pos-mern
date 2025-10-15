const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,  MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import * as yup from 'yup';
import axios from 'axios';
import SuccessAlert from '../../../components/AlertSuccess';
import WarningAlert from '../../../components/AlertDivWarn';
import ErrorBoundary from '../../ErrorBoundary';

interface DeliveryNoteDetail {
    _id: string;
    delivery_Quantity: number;
    delivery_Price: number;
    delivery_Note_Id: string;
    product_Id: any;
}

interface FormData {
    delivery_Quantity: number;
    delivery_Price: number;
    product_Id: string;
}

interface OrderProductDetailsProps {
    id: string; // OrderProduct ID
    onClose: () => void;
}

const schema = yup.object({
    delivery_Quantity: yup.number().required('กรุณาใส่จำนวนสินค้า').min(1, 'จำนวนต้องมากกว่า 0'),
    delivery_Price: yup.number().required('กรุณาใส่จำนวนสินค้า').min(1, 'จำนวนต้องมากกว่า 0'),
    product_Id: yup.string().required('กรุณาเลือกสินค้า'),
}).required();

const DoceFaltur: React.FC<OrderProductDetailsProps> = ({ id, onClose }) => {
    const [rows, setRows] = useState<GridRowsProp<DeliveryNoteDetail>>([]);
    const [open, setOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
    const [alertMessage, setAlertMessage] = useState<React.ReactNode | null>(null);
    const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [_, setUnits] = useState<any[]>([]);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const fetchData = async () => {
        try {
            const orderDetailResponse = await axios.get(`${API_URL}/api/data/getDeliveryNoteDetail/${id}`);
            setRows(orderDetailResponse.data.deliverynotedetail);
            setProducts(orderDetailResponse.data.product);
            setUnits(orderDetailResponse.data.unit);

            console.log('row:', orderDetailResponse.data.product);
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
                setValue('product_Id', selectedRow.product_Id?._id);
                setValue('delivery_Quantity', selectedRow.delivery_Quantity);
                setValue('delivery_Price', selectedRow.delivery_Price);
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
        { field: 'product_Id', headerName: 'ชื่อสินค้า', flex: 1, minWidth: 180, renderCell: (params) => params.row?.product_Id?.product_Name },
        { field: 'delivery_Quantity', headerName: 'จำนวน', flex: 1, minWidth: 100, renderCell: (params) => params.row?.delivery_Quantity },
        { field: 'delivery_price', headerName: 'ราคา/หน่วย', flex: 1, minWidth: 100, renderCell: (params) => params.row?.delivery_Price },
        {
            field: 'total',
            headerName: 'ราคารวม',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
              const quantity = params.row?.delivery_Quantity || 0;
              const price = params.row?.delivery_Price || 0;
              const total = quantity * price;
              return total.toLocaleString(); // แสดงแบบมี comma เช่น 1,200
            }
          },
        { field: 'unit_Id', headerName: 'หน่วย', flex: 1, minWidth: 100, renderCell: (params) => params.row?.product_Id?.unitId?.unit_Name }, // เพิ่มคอลัมน์ราคา
        {
            field: 'actions',
            headerName: 'แก้ไขข้อมูล',
            width: 100,
            renderCell: (params) => (
                <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditClick(params.id as string)}>
                    แก้ไข
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: 'ลบข้อมูล',
            width: 100,
            renderCell: (params) => (
                <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteDeleteClick(params.id as string)}>
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

    const handleEditClick = (id: GridRowId) => {
        // Set the selected row and open the dialog for editing
        setSelectedRowId(id);
        setOpen(true);
    };

    const handleDeleteDeleteClick = async (id: GridRowId) => {
        const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลนี้?');
        if (confirmDelete) {
            try {
                const deliverynotedetail = rows.find((row) => row._id === id)?._id;
                if (deliverynotedetail) {
                    await axios.delete(`${API_URL}/api/data/deleteDeliveryNoteDetail/${deliverynotedetail}`);

                    const updatedRows = rows.filter((row) => row._id !== deliverynotedetail);
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
                    delivery_Quantity: data.delivery_Quantity,
                    delivery_Price: data.delivery_Price,
                    delivery_Note_Id: id,
                    product_Id: data.product_Id
                };

                await axios
                    .put(`${API_URL}/api/data/updateDeliveryNoteDetail/${selectedRowId}`, updatedData)
                    .then((response) => {
                        console.log('Update successful', response.data);
                        fetchData();
                        setAlertSuccess(<div>{response.data.message}</div>);

                        const updatedRows = rows.map((row) =>
                            row._id === selectedRowId ? { ...row, ...updatedData } : row
                        );
                        setRows(updatedRows);
                    })
                    .catch((error: any) => {
                        console.error('Error updating data:', error);
                        setAlertMessage(<div>{error.response.data.message}</div>);
                    });
            } else {
                const addData = {
                    delivery_Quantity: data.delivery_Quantity,
                    delivery_Price: data.delivery_Price,
                    delivery_Note_Id: id,
                    product_Id: data.product_Id

                };

                const response = await axios.post(
                    `${API_URL}/api/data/createDeliveryNoteDetail`,
                    addData
                );

                if (response.status === 200) {
                    // fetchData();
                    setRows([...rows, response.data.deliverynotedetail]);
                    console.log(response.data.deliverynotedetail)
                    setAlertSuccess(<div>เพิ่มข้อมูลสำเร็จ</div>);
                } else {
                    setAlertMessage(<div>เกิดข้อผิดพลาดในการเพิ่มข้อมูล</div>)
                }
            }
            handleClose();
        } catch (error: any) {
            console.error('Error submitting data:', error);
            setAlertMessage(<div>{error.response}</div>);
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
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                >
                                    {Array.isArray(products) && products.length > 0 ? (
                                        products.map((product) => (
                                            <MenuItem key={product._id} value={product._id}>
                                                {product?.product_Name} {product?.unitId?.unit_Name}
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
                            name="delivery_Quantity"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="จำนวนสินค้า" type="number" error={!!errors.delivery_Quantity} helperText={errors.delivery_Quantity?.message}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} // แปลงค่าเป็นตัวเลข
                                    value={field.value || 0} // ถ้าไม่มีค่าให้ใช้ค่าเริ่มต้นเป็น 0
                                />
                            )}
                        />
                        <Controller
                            name="delivery_Price"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field}
                                    label="ราคา"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    error={!!errors.delivery_Price}
                                    helperText={errors.delivery_Price?.message}
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

export default DoceFaltur;
