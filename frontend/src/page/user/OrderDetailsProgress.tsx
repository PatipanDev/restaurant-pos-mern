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
    Box,
    Menu,
    Skeleton
} from '@mui/material';
import { Close } from '@mui/icons-material';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatDateTime } from '../../utils/formatDateTime';


const API_URL = import.meta.env.VITE_API_URL;



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


interface DrinkDetailProps {
    _id: string | null;
    onClose: () => void;  // เพิ่มฟังก์ชันปิด
}


const OrderDetailsCheck: React.FC<DrinkDetailProps> = ({ _id, onClose }) => {
    const [order, setOrders] = useState<any[]>([]);
    const [orderFoodDetails, setOrderFoodDetails] = useState<any[]>([]);
    const [orderDrinkDetails, setOrderDrinkDetails] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);




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
            const response = await axios.get(`${API_URL}/api/food/getPendingOrdersByEmployee/${_id}`);
            setOrders(response.data.orders);
            setOrderFoodDetails(response.data.orderFoodDetails);
            setOrderDrinkDetails(response.data.orderDrinkDetails);
            console.log(response.data);

        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false); // ✅ โหลดเสร็จแล้ว
        }
    };

    useEffect(() => {
        if (_id) {  // ตรวจสอบว่า customerId มีค่า
            fetchPendingOrders();
        }
    }, [_id]);  // เพิ่ม customerId ใน dependency array

    console.log("มีข้อมูลไหม", order)
    console.log("ข้อมูล", _id)

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
    if (order.length === 0) {
        return (
            <div>
                <IconButton
            sx={{
              position: 'absolute',
              top: 120,
              left: 10,
              zIndex: 10,
              backgroundColor: '#F0FFFF'
            }}
            onClick={onClose}
            color="primary"
          >
            <Close />
          </IconButton>
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
            </div>
        )
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
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>ดูรายละเอียด</MenuItem>
                    <MenuItem onClick={handleClose}>แก้ไข</MenuItem>
                    <MenuItem onClick={handleClose}>ลบ</MenuItem>
                </Menu>
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
                            <Typography variant="body1">โต๊ะ: หมายเลข {item.table_Id.number} จำนวน {item.table_Id.seat_count} ที่นั่ง</Typography>
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
                                    <TableCell>x{FoodDetails.orderDetail_Quantity}</TableCell>
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
                                    <TableCell>x{DrinkDetails.orderDetail_Quantity}</TableCell>
                                    <TableCell>{DrinkDetails.drink_Id.drink_Price}</TableCell>
                                    <TableCell>{DrinkDetails.orderDetail_Quantity * parseFloat(DrinkDetails.drink_Id.drink_Price)} บาท</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="right" marginBottom={6}>
                ราคารวม: {loading ? <Skeleton variant="text" width={80} /> : `${totalPrice} บาท`}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <IconButton
            sx={{
              position: 'absolute',
              top: 120,
              left: 10,
              zIndex: 10,
              backgroundColor: '#F0FFFF'
            }}
            onClick={onClose}
            color="primary"
          >
            <Close />
          </IconButton>
        </Container>
    );
}

export default OrderDetailsCheck;