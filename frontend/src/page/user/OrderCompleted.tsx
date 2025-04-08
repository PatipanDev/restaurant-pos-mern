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

import SuccessAlert from '../../components/AlertSuccess';
import { getUserId } from '../../utils/userUtils';
import { formatDateTime } from '../../utils/formatDateTime';

import socket from '../../utils/socket';


const API_URL = import.meta.env.VITE_API_URL;
const id: string = getUserId();
console.log(id)


interface Order {
    createdAt: Date;
    order_Status: string;
    order_Eating_status: string;
    table_Id: { number: number };
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


const OrderCompleted: React.FC = () => {
    const [order, setOrders] = useState<Order[]>([]);
    const [orderFoodDetails, setOrderFoodDetails] = useState<any[]>([]);
    const [orderDrinkDetails, setOrderDrinkDetails] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [payments, setPayment] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);
    const [isPaymentPending, setIsPaymentPending] = useState(false);

    // const {formattedDate, formattedTime} = formatDateTime()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const fetchPendingOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/food/getCompletedOrdersByCustomer/${id}`);
            setOrders(response.data.orders);
            setOrderFoodDetails(response.data.orderFoodDetails);
            setOrderDrinkDetails(response.data.orderDrinkDetails);
            setTables(response.data.tables);
            // console.log('fsdfdsf',response.data.payment)
            if (response.data.payment && response.data.payment.length > 0) {
                setPayment(response.data.payment);
                // อาจจะตั้งค่า isPaymentPending เป็น false ในกรณีที่มีข้อมูลแล้ว
                setIsPaymentPending(true);
            } else {
                // กรณีไม่มีข้อมูลการชำระเงิน (อาเรย์ว่างเปล่า หรือ payment เป็น null/undefined)
                setPayment([]); // หรือค่าเริ่มต้นอื่น ๆ ที่เหมาะสม
                // setIsPaymentPending(true); // หรือคงค่าเดิมไว้ ขึ้นอยู่กับ logic
            }
            console.log(response.data);

        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false); // ✅ โหลดเสร็จแล้ว
        }
    };

    const fetchPayment = async (order_Id: string) => {
        try {
            const response = await axios.get(`${API_URL}/api/food/getPaymentsByOrder/${order_Id}`);
            setPayment(response.data.orders);
            console.log('dsdsds',response.data);
            if (response.data.orders && response.data.orders.length > 0) {
                setIsPaymentPending(false)

            } else {
                setIsPaymentPending(true)
            }

        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false); // ✅ โหลดเสร็จแล้ว
        }
    };

    useEffect(() => {
        if (id) {  // ตรวจสอบว่า customerId มีค่   
            fetchPendingOrders();
        }
    }, [id]);  // เพิ่ม customerId ใน dependency array

    console.log("มีข้อมูลไหม", payments)
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

    const handleConfirmServ = async (orderId: string) => {
        const isConfirmed = window.confirm("คุณต้องการยืนยันว่าทำอาหารเสร็จใช่หรือไม่?");
        if (!isConfirmed) {
            console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
            return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
        }
        try {
            console.log("ชื่อ", id, "oder", orderId)
            // ส่งข้อมูลไปที่ Server เพื่อยืนยันคำสั่งซื
            const response = await axios.post(`${API_URL}/api/food/createPaymentOrderCustomer`, { id, orderId });
            console.log('Update successful', response);
            setAlertSuccess(<div>{"กรุณาไปชำระเงินที่หน้าเค้าเตอร์"}</div>);
            setTimeout(async () => {
                await fetchPendingOrders();
                fetchPayment(orderId);
            }, 2000);
        } catch (error: any) {
            console.log("Error data message", error);
            setAlertSuccess(<div>{error.response?.data?.message || "เกิดข้อผิดพลาด"}</div>);
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

    return (
        <Container maxWidth="sm" sx={{ mt: 4, p: 3, bgcolor: '#fff', boxShadow: 3, borderRadius: 2, }}>
            {/* ส่วนหัวที่มีไอคอนเมนูและราคารวม */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">เมนูอาหาร</Typography>
                <IconButton
                    aria-label="menu"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>ดูรายละเอียด</MenuItem>
                    <MenuItem onClick={handleClose}>แก้ไข</MenuItem>
                    <MenuItem onClick={handleClose}>ลบ</MenuItem>
                </Menu>
            </Box> */}
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
                            <Typography
                                variant="h5"
                                align="center"
                                gutterBottom
                                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
                            >
                                ใบสั่งอาหาร
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
                            >
                                รหัสออเดอร์: #{item._id.substring(0, 6)}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
                            >
                                โต๊ะ หมายเลข: #{item?.table_Id?.number}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                align="center"
                                gutterBottom
                                sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
                            >
                                วันที่: {formattedDate} เวลา {formattedTime}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography
                                variant="body1"
                                sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
                            >
                                สถานะออเดอร์: {translateStatus(item.order_Status)}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
                            >
                                สถานะการกิน: {translateEatStatus(item.order_Eating_status)}
                            </Typography>
                        </div>
                    );
                })
            )}

            <Divider sx={{ my: 2 }} />
            <Typography
                variant="h6"
                align="left"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
            >
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
                                    <TableCell>{FoodDetails.food_Id.food_Name}</TableCell>
                                    <TableCell>{FoodDetails.orderDetail_More}</TableCell>
                                    <TableCell>x{FoodDetails.orderDetail_Quantity}</TableCell>
                                    <TableCell>{parseFloat(FoodDetails.food_Id.food_Price.$numberDecimal)}</TableCell>
                                    <TableCell>{FoodDetails.orderDetail_Quantity * parseFloat(FoodDetails.food_Id.food_Price.$numberDecimal)} บาท</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography
                variant="h6"
                align="left"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
            >
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
                                    <TableCell>x{DrinkDetails.orderDetail_Quantity}</TableCell>
                                    <TableCell>{DrinkDetails.drink_Id.drink_Price}</TableCell>
                                    <TableCell>{DrinkDetails.orderDetail_Quantity * parseFloat(DrinkDetails.drink_Id.drink_Price)} บาท</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography
                variant="h6"
                align="right"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} // ปรับขนาดตัวอักษรสำหรับมือถือ
            >
                ราคารวม: {loading ? <Skeleton variant="text" width={80} /> : `${totalPrice} บาท`}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {order.map((item) => (
                <Box key={item._id} display="flex" gap={2} alignItems="center" sx={{ marginBottom: 20 }}>
                    <Button
                        fullWidth
                        type='submit'
                        variant="contained"
                        color="primary"
                        sx={{ flex: 1 }}
                        disabled={isPaymentPending}
                        onClick={() => handleConfirmServ(item._id)}
                    >
                        {loading ? (
                            <Skeleton variant="text" width="50px" />
                        ) : (
                            isPaymentPending ? "ขอบคุณที่ใช้บริการ" :  "ชำระเงิน"
                        )}
                    </Button>
                    <SuccessAlert successalert={alertSuccess} />
                </Box>

            ))}

        </Container>
    );
}

export default OrderCompleted;