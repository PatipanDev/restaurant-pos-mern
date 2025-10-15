import React, { useState, useEffect} from "react";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import { Close } from '@mui/icons-material';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
} from "@mui/material";
import { formatDateTime } from "../../../utils/formatDateTime";



// กำหนดชนิดข้อมูลที่รับมาจาก API สำหรับใบเสร็จ
const API_URL = import.meta.env.VITE_API_URL;

interface ReceiptProps {
    id: string;       // รับ id แบบ string  // รับ data เป็น array ใด ๆ
    onClose: () => void;  // เพิ่มฟังก์ชันปิด
}

const Receipt: React.FC<ReceiptProps> = ({ id, onClose }) => {
    const [orderDetails, _] = useState<any[]>([]); // ข้อมูลใบเสร็จ
    const [loading, setLoading] = useState<boolean>(true); // สCถานะการโหลด
    const [error, setError] = useState<string | null>(null); // ข้อความแสดงเมื่อเกิดข้อผิดพลาด

    const [receipt, setReceipt] = useState<any[]>([]);
    const [orderFoodDetails, setOrderFoodDetails] = useState<any[]>([]);
    const [orderDrinkDetails, setOrderDrinkDetails] = useState<any[]>([]);

    // ดึงข้อมูลใบเสร็จจาก API
    useEffect(() => {
        const fetchReceiptData = async () => {
            try {
                console.log("ในคอมโพเน้น", id)
                const response = await axios.get(`${API_URL}/api/food/getReceipt/${id}`);
                console.log("fdfdfd", response.data)
                setReceipt(response.data.receipt)
                setOrderDrinkDetails(response.data.orderDrinkDetails)
                setOrderFoodDetails(response.data.orderFoodDetails)

                setLoading(false);
            } catch (err) {
                setError("ไม่สามารถดึงข้อมูลใบเสร็จได้");
                setLoading(false);
            }
        };

        fetchReceiptData();
    }, []);

    useEffect(() => {
        // ตรวจสอบข้อมูล receipt
        console.log("receipt =>", receipt);
    }, [receipt]);


    // เมื่อข้อมูลยังโหลด
    if (loading) return <div>กำลังโหลด...</div>;

    // หากเกิดข้อผิดพลาดในการดึงข้อมูล
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>ใบเสร็จ</h1>
            {orderDetails ? (

                <Box sx={{ width: "30vw", p: 2 }}>
                    {/* Table: Order List */}
                    <TableContainer component={Paper} sx={{ maxHeight: "60%", overflowY: "auto" }}>

                        {receipt
                            .map((item) => {
                                const { formattedDate, formattedTime } = formatDateTime(item?.createdAt);
                                const receiptId = item?.Receipt_ID; // หรือ item?.order_Id?.Receipt_ID
                                console.log("ค่าที่ได้", receiptId)
                                return (
                                    <Box key={item?._id}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        margin: 2,
                                                        flex: 1,
                                                        textAlign: 'center',  // แก้จาก 'left' เป็น 'center' เพื่อให้อยู่ตรงกลาง
                                                        fontSize: '0.75rem',
                                                        whiteSpace: 'nowrap', // ป้องกันการตัดข้อความ
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis', // เมื่อข้อความยาวเกินให้แสดง ...
                                                    }}
                                                >
                                                    ออเดอร์ #{item?.Receipt_ID}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ margin: 2, flex: 1, textAlign: 'center', fontSize: '0.75rem' }} // ปรับขนาดตัวอักษรที่นี่
                                                >
                                                    โต๊ะ {item?.order_Id?.table_Id?.number}
                                                </Typography>


                                            </Box>


                                            <Typography
                                                variant="body2"
                                                sx={{ margin: 2, flex: 1, textAlign: 'right', fontSize: '0.75rem' }} // ปรับขนาดตัวอักษรที่นี่
                                            >
                                                วันที่ {formattedDate} เวลา {formattedTime} น.
                                            </Typography>
                                        </Box>

                                        <Typography variant="h6" sx={{ margin: 2, fontSize: '0.75rem' }}>
                                            รายการอาหาร
                                        </Typography>
                                    </Box>

                                )
                            })}

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>ลำดับ</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>ชื่ออาหาร</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>ราคา (บาท)</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>จำนวน</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>รวม (บาท)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderFoodDetails.map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>{item?.food_Id?.food_Name}</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>
                                            {parseFloat(item.food_Id.food_Price.$numberDecimal)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>{item?.orderDetail_Quantity}</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>
                                            {parseFloat(item.food_Id.food_Price.$numberDecimal) * parseFloat(item?.orderDetail_Quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" sx={{ margin: 2, fontSize: '0.75rem' }}>รายเครื่องดื่ม</Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>ลำดับ</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>ชื่อเครื่องดื่ม</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>ราคา (บาท)</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>จำนวน</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem' }}>รวม (บาท)</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {orderDrinkDetails.map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>{index + 1}</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>{item?.drink_Id?.drink_Name}</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>
                                            {parseFloat(item.drink_Id?.drink_Price)}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>{item?.orderDetail_Quantity}</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem' }}>
                                            {parseFloat(item.drink_Id?.drink_Price) * parseFloat(item?.orderDetail_Quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {receipt.map((item) => {
                            return (
                                <Box key={item._id}>
                                    <Typography variant="h6" sx={{ marginLeft: 2, fontSize: '0.75rem' }}> {/* ปรับขนาดตัวอักษรที่นี่ */}
                                        วิธีการชำระเงิน {item?.payment_Id?.payment_Method}
                                    </Typography>

                                    <Box sx={{ margin: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2 }}>
                                        <Typography variant="h6" sx={{ fontSize: '0.75rem' }}>
                                            เงินที่รับมา {parseFloat(item?.payment_Id?.received_Amount?.$numberDecimal)} บาท
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontSize: '0.75rem' }}>
                                            เงินทอน {parseFloat(item?.payment_Id?.change_Amount?.$numberDecimal)} บาท
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontSize: '0.75rem' }}>
                                            เงินที่ชำระ {parseFloat(item?.payment_Id?.paid_Amount?.$numberDecimal)} บาท
                                        </Typography>
                                    </Box>

                                </Box>
                            );
                        })}

                        {/* <div style={{ margin: 2 }}>
                            <PDFDownloadLink
                                document={<ReceiptPDF receipt={receipt} orderFoodDetails={orderFoodDetails} orderDrinkDetails={orderDrinkDetails} />}
                                fileName="receipt.pdf"
                            >
                                {({ loading }) => (
                                    <button style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
                                        {loading ? 'กำลังสร้างไฟล์ PDF...' : 'ดาวน์โหลด PDF'}
                                    </button>
                                )}
                            </PDFDownloadLink>
                            <button
                                onClick={handlePrint}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#008CBA',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    marginLeft: '10px',
                                }}
                            >
                                พิมพ์ใบเสร็จ
                            </button>
                        </div> */}

                    </TableContainer>

                </Box>
            ) : (
                <div>
                    {/* <div>ไม่พบข้อมูลใบเสร็จ</div> */}
                    <IconButton
                        sx={{
                            position: 'absolute',
                            width: 50,
                            height: 50,
                            top: 100,
                            right: 150,
                            zIndex: 100,
                            backgroundColor: '#F0FFFF'
                        }}
                        onClick={onClose}
                        color="primary"
                    >
                        <Close />
                    </IconButton>
                </div>
            )}
            <div>
                <IconButton
                    sx={{
                        position: 'absolute',
                        width: 50,
                        height: 50,
                        top: 100,
                        right: 150,
                        zIndex: 10,
                        backgroundColor: '#F0FFFF'
                    }}
                    onClick={onClose}
                    color="primary"
                >
                    <Close />
                </IconButton>
            </div>
        </div>
    );
};

export default Receipt;
