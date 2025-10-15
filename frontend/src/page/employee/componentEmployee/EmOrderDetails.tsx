import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    MenuItem,
    Button,
    Box,
    TextField,
    Menu,
    Skeleton
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useForm, Controller } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import SuccessAlert from '../../../components/AlertSuccess';
import { getEmployeeId } from '../../../utils/userUtils';
import { formatDateTime } from '../../../utils/formatDateTime';

import socket from '../../../utils/socket';


const API_URL = import.meta.env.VITE_API_URL;
const id: string = getEmployeeId();
console.log(id)


interface Order {
    createdAt: Date;
    order_Status: string;
    order_Eating_status: string;
    _id: string;

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

const translateEatStatus = (status: string) => {
    switch (status) {
        case 'Dine-in':
            return 'รับประทานที่ร้าน';
        case 'Takeout':
            return 'สั่งกลับบ้าน';
        default:
            return status; // ถ้าสถานะไม่ตรงกับที่กำหนด, ให้แสดงสถานะเดิม
    }
};

interface FormOrder {
    order_Eating_status?: string | undefined;
    table_Id: string;
    order_Dec?: string | undefined;
}

const schema = yup.object({
    order_Eating_status: yup.string(),
    table_Id: yup.string().required("กรุณาเลือกโต๊ะ"), // บังคับเลือก
    order_Dec: yup.string()
}).required();


function EmOrderDetails() {
    const [order, setOrders] = useState<Order[]>([]);
    const [orderFoodDetails, setOrderFoodDetails] = useState<any[]>([]);
    const [orderDrinkDetails, setOrderDrinkDetails] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);



    const { control, handleSubmit, reset,  formState: { errors } } = useForm<FormOrder>({
        resolver: yupResolver(schema),
    });

    // const {formattedDate, formattedTime} = formatDateTime()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchPendingOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/food/getPendingOrdersByCustomerOrEmployee/${id}`);
            setOrders(response.data.orders);
            setOrderFoodDetails(response.data.orderFoodDetails);
            setOrderDrinkDetails(response.data.orderDrinkDetails);
            setTables(response.data.tables);
            console.log(response.data);

        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false); // ✅ โหลดเสร็จแล้ว
        }
    };

    useEffect(() => {
        socket.connect();
        if (id) {  // ตรวจสอบว่า customerId มีค่า
            fetchPendingOrders();
        }
    }, [id]);  // เพิ่ม customerId ใน dependency array

    console.log("มีข้อมูลไหม", orderDrinkDetails)
    // console.log('ลง', order.orders[0]._id)

    const totalFoodPrice = orderFoodDetails.reduce(
        (sum, FoodDetails) =>
            sum + FoodDetails.orderDetail_Quantity * parseFloat(FoodDetails.food_Id.food_Price.$numberDecimal),
        0
    );

    const totalDrinkPrice = orderDrinkDetails.reduce(
        (sum, DrinkDetails) =>
            sum + DrinkDetails.orderDetail_Quantity * parseFloat(DrinkDetails.drink_Id.drink_Price),
        0
    );

    const totalPrice = totalFoodPrice + totalDrinkPrice;
    console.log(totalPrice)

    const onSubmit = async (data: FormOrder) => {
        if (window.confirm("คุณต้องการสั่งอาหารใช่หรือไม่ ?")) {
            try {
                const id = order.map((order) => order._id)[0] ?? '';
                const employee_Id = getEmployeeId();
                console.log('ไอดี', id);
                const orderData = {
                    ...data,
                    employee_Id: employee_Id
                };

                console.log('Order Data:', orderData);
                console.log('Form Data:', data);

                // ส่งข้อมูลไปยัง server ผ่าน socket.emit โดยไม่ต้องรอการตอบกลับ
                socket.emit('putSendOrderDetail', { id, ...orderData });

                // รีเซ็ตข้อมูลหรือแจ้งเตือน UI ตามที่ต้องการ
                setAlertSuccess(<div>สั่งอาหารสำเร็จ</div>);
                setTimeout(() => {
                    // fetchPendingOrders();
                    setOrders([]);
                    setOrderDrinkDetails([]);
                    setOrderFoodDetails([]);
                    reset();
                }, 2000);

            } catch (error: any) {
                console.error('Error submitting order:', error);
                alert(error.response?.message || 'เกิดข้อผิดพลาด');
            }
        }
    };

    if (order.length === 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh" // ทำให้ Box เต็มความสูงของ viewport
            >
                <Typography variant="body1" align="center">
                    ไม่มีรายการ
                </Typography>
            </Box>
        )
    }

    const onCancelled = async (order_id: string) => {
        if (window.confirm("คุณต้องการสั่งอาหารใช่หรือไม่ ?")) {
            try {
                socket.emit('CancelledOrderDetail', {order_id});

                setAlertSuccess(<div>ยกเลิกออเดอร์สำเร็จ</div>);
                setTimeout(() => {
                    // fetchPendingOrders();
                    setOrders([]);
                    setOrderDrinkDetails([]);
                    setOrderFoodDetails([]);
                    reset();
                }, 2000);
            } catch (error) {

            };
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, p: 3, bgcolor: '#fff', boxShadow: 3, borderRadius: 2 }}>
            {/* ส่วนหัวที่มีไอคอนเมนูและราคารวม */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">เมนูอาหาร</Typography>
                <IconButton
                    aria-label="menu"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                {order.map((item) => (
                    <Menu
                    key={item._id}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => onCancelled(item._id)}>ยกเลิกรายการ</MenuItem>
                    </Menu>
                ))}
            </Box>
            {/* แสดง Skeleton ขณะโหลดข้อมูล */}
            {loading ? (
                <>
                    <Skeleton variant="text" width="100%" height={30} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={100} sx={{ my: 2 }} />
                </>
            ) : (
                order.map((item) => {
                    const { formattedDate, formattedTime } = formatDateTime(item.createdAt);
                    return (
                        <div key={item._id}>
                            <Typography variant="h5" align="center" gutterBottom>
                                ใบสั่งอาหาร
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                รหัสออเดอร์: #{item._id.substring(0, 6)}
                            </Typography>
                            <Typography variant="subtitle2" align="center" gutterBottom>
                                วันที่: {formattedDate} เวลา {formattedTime}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1">สถานะออเดอร์: {translateStatus(item.order_Status)}</Typography>
                            <Typography variant="body1">สถานะการกิน: {translateEatStatus(item.order_Eating_status)}</Typography>
                        </div>
                    );
                })
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="left">
                รายการอาหาร
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>ชื่อ</TableCell>
                            <TableCell>เพิ่มเติม</TableCell>
                            <TableCell>จำนวน</TableCell>
                            <TableCell>ราคา/หน่วย</TableCell>

                            <TableCell>ราคา</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading
                            ? Array.from(new Array(3)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton variant="text" /></TableCell>
                                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={50} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={50} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                                </TableRow>
                            ))
                            : orderFoodDetails.map((FoodDetails, index) => (
                                <TableRow key={FoodDetails._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{FoodDetails.food_Id.food_Name} </TableCell>
                                    <TableCell>{FoodDetails.orderDetail_More}</TableCell>
                                    <TableCell>{FoodDetails.orderDetail_Quantity}</TableCell>
                                    <TableCell>{parseFloat(FoodDetails.food_Id.food_Price.$numberDecimal)}</TableCell>
                                    <TableCell>{FoodDetails.orderDetail_Quantity * parseFloat(FoodDetails.food_Id.food_Price.$numberDecimal)} บาท</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="left">
                รายการเครื่องดื่ม
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>ชื่อ</TableCell>
                            <TableCell>เพิ่มเติม</TableCell>
                            <TableCell>จำนวน</TableCell>
                            <TableCell>ราคา/หน่วย</TableCell>
                            <TableCell>ราคา</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading
                            ? Array.from(new Array(3)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton variant="text" /></TableCell>
                                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={50} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={50} /></TableCell>
                                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                                </TableRow>
                            ))
                            : orderDrinkDetails.map((DrinkDetails, index: number) => (
                                <TableRow key={DrinkDetails._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{DrinkDetails.drink_Id.drink_Name}</TableCell>
                                    <TableCell>{DrinkDetails.orderDetail_More}</TableCell>
                                    <TableCell>{DrinkDetails.orderDetail_Quantity}</TableCell>
                                    <TableCell>{DrinkDetails.drink_Id.drink_Price}</TableCell>
                                    <TableCell>{DrinkDetails.orderDetail_Quantity * parseFloat(DrinkDetails.drink_Id.drink_Price)} บาท</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="right">
                ราคารวม: {loading ? <Skeleton variant="text" width={80} /> : `${totalPrice} บาท`}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" gap={2} alignItems="center" sx={{ marginBottom: 2 }}>
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={80} />
                    ) : (
                        <Controller
                            name="order_Dec"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="string"
                                    label="รายละเอียดเพิ่มเติม"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!errors.order_Dec}
                                    helperText={errors.order_Dec?.message}
                                />
                            )}
                        />
                    )}
                </Box>
                <Box display="flex" gap={2} alignItems="center" sx={{ marginBottom: 6 }}>
                    <Controller
                        name="order_Eating_status"
                        control={control}

                        defaultValue="Dine-in" // กำหนดค่าเริ่มต้น
                        render={({ field }) => (
                            <TextField
                                select
                                defaultValue="Dine-in"
                                label="ตัวเลือกรับประมาน"
                                fullWidth
                                margin="dense"
                                error={!!errors.order_Dec}
                                helperText={errors.order_Dec?.message}
                                value={field.value || "Dine-in"} // ✅ ป้องกัน undefined
                                onChange={field.onChange}
                            >
                                <MenuItem value="Dine-in">รับประทานที่ร้าน</MenuItem>
                                <MenuItem value="Takeout">สั่งกลับบ้าน</MenuItem>
                            </TextField>
                        )}
                    />

                    <Controller
                        name="table_Id"
                        control={control}
                        rules={{ required: "กรุณาเลือกโต๊ะ" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="โต๊ะ"
                                fullWidth
                                margin="dense"
                                error={!!errors.table_Id}
                                helperText={errors.table_Id?.message}
                                value={field.value || ""}
                                onChange={field.onChange}
                            >
                                {tables.map((table) => (
                                    <MenuItem
                                        key={table._id}
                                        value={table._id}
                                        disabled={table.status !== "Available"} // ถ้าสถานะไม่ใช่ Available จะไม่สามารถเลือกได้
                                    >
                                        โต๊ะ {table.number}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Button
                        fullWidth
                        type='submit'
                        variant="contained"
                        color="primary"
                        sx={{ flex: 1 }}
                    >
                        {loading ? <Skeleton variant="text" width="50px" /> : "สั่งซื้อ"}
                    </Button>
                    <SuccessAlert successalert={alertSuccess} />
                </Box>
            </form>
        </Container>
    );
}


export default EmOrderDetails;