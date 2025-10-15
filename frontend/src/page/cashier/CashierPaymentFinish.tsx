import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  List,
  ListItemText,
  ListItemButton,
  Divider, IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

import { formatDateTime } from "../../utils/formatDateTime";


import Receipt from "./component/Receipt";

import SuccessAlertCashier from "../../components/AlertSussessCashier";




const translateStatus = (status: string) => {
  switch (status) {
    case 'Pending':
      return (
        <span style={{ color: 'orange' }}>
          <span role="img" aria-label="pending">⏳</span> รอดำเนินการ
        </span>
      );
    case 'In Progress':
      return (
        <span style={{ color: 'blue' }}>
          <span role="img" aria-label="in-progress">🔄</span> กำลังดำเนินการ
        </span>
      );
    case 'On Hold':
      return (
        <span style={{ color: 'gray' }}>
          <span role="img" aria-label="on-hold">⏸️</span> เสร็จสิ้น
        </span>
      );
    case 'Completed':
      return (
        <span style={{ color: 'green' }}>
          <span role="img" aria-label="completed">✔️</span> เสร็จสิ้น
        </span>
      );
    case 'Cancelled':
      return (
        <span style={{ color: 'red' }}>
          <span role="img" aria-label="cancelled">❌</span> ยกเลิก
        </span>
      );
    default:
      return status; // ถ้าสถานะไม่ตรงกับที่กำหนด, ให้แสดงสถานะเดิม
  }
};

const CashierPaymentFinish: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFoodDetails, setOrderFoodDetails] = useState<any[]>([]);
  const [orderDrinkDetails, setOrderDrinkDetails] = useState<any[]>([]);
  const [payment, setPayment] = useState<any[]>([])

  const [idrecipt, setIdrecipt] = useState<string>("")

  const [paidAmount, setPaidAmount] = useState<number>(0);

  const [alertSuccess, _] = useState<React.ReactNode | null>(null);


  // เมื่อเลือกรายการอาหาร
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // ใช้เก็บค่า query ค้นหาจากผู้ใช้ 

  useEffect(() => {
    fetchListOrder();
  }, [])

  const fetchListOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/food/getpaymentorderByCashierFinish`);

      setOrders(response.data.orders);
      setOrderFoodDetails(response.data.orderFoodDetails);
      setOrderDrinkDetails(response.data.orderDrinkDetails);
      setPayment(response.data.payment)
      if (response.data.payment) {
      }
      console.log(response.data);

    } catch (error) {
      console.error('Error fetching order data:', error);
    } finally {

    }
  }

  // ค้นหารายหารออเดอร์
  const filteredOrders = orders.filter((item) =>
    item?.customer_Id?.customer_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.table_Id?.number.toString().includes(searchQuery) // ค้นหาโดยใช้หมายเลขโต๊ะ
  );


  useEffect(() => {
    const totalFoodPrice = orderFoodDetails
      .filter((item) => item.order_Id === selectedOrder)
      .reduce(
        (sum, FoodDetails) =>
          sum + FoodDetails.orderDetail_Quantity * parseFloat(FoodDetails.food_Id.food_Price.$numberDecimal || "0"),
        0
      );

    const totalDrinkPrice = orderDrinkDetails
      .filter((item) => item.order_Id === selectedOrder)
      .reduce(
        (sum, DrinkDetails) =>
          sum + DrinkDetails.orderDetail_Quantity * parseFloat(DrinkDetails.drink_Id.drink_Price || "0"),
        0
      );

    const totalPrice = totalFoodPrice + totalDrinkPrice;

    setPaidAmount(totalPrice); // อัพเดต state ด้วยค่า totalPrice ที่คำนวณ
  }, [orderFoodDetails, orderDrinkDetails, selectedOrder]);

  // setPaidAmount(totalPrice); // ตรวจสอบค่า totalPrice ก่อนใช้

  // setCashReceived(change);

  //เมื่อเลือกรายการ
  const handleClickSelect = (id: any) => {
    setSelectedOrder(id)

  }

  const handleRefresh = () => {
    fetchListOrder();
  };

  const handdlecloseDetail = () => {
    setIdrecipt(""); // ปิด Modal
  };

  return (
    <Container maxWidth={false} sx={{ height: "85vh", width: "80vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {idrecipt ? (
        <div>
          {idrecipt && <Receipt id={idrecipt} onClose={handdlecloseDetail} />}
        </div>
      ) : (
        <Box sx={{ width: "100%", height: "90%", display: "flex" }}>
          {/* Order List on the Left */}
          <Box sx={{ width: "30%", overflowY: "auto", p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              ประวัติการชำระเงิน
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Typography>
            {/* คอมโพเนนต์ TextField สำหรับการค้นหา */}
            <TextField
              label="ค้นหาออเดอร์"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // เมื่อผู้ใช้กรอกข้อความจะอัพเดตค่า searchQuery
              sx={{ mb: 2 }}
            />

            {/* แสดงรายการที่กรองแล้ว */}
            <List>
              {filteredOrders.map((item) => (
                <ListItemButton key={item._id} onClick={() => handleClickSelect(item._id)}>
                  <ListItemText
                    primary={`ออเดอร์ #${item?._id.substring(0, 6)} - โต๊ะหมายเลข ${item.table_Id?.number || 'ยังไม่ได้เลือก'}`}
                    secondary={`ลูกค้า: ${item?.customer_Id?.customer_Name || "**พนักงานสั่ง"} | พนักงาน: ${item?.employee_Id?.employee_Name || "ยังไม่ยืนยันออเดอร์โดยพนักงาน"}`}
                  />
                </ListItemButton>
              ))}

            </List>
          </Box>

          {/* Table and Payment on the Right */}
          <Box sx={{ width: "70%", p: 2 }}>
            {/* Table: Order List */}
            <TableContainer component={Paper} sx={{ maxHeight: "90%", overflowY: "auto" }}>
              {orders
                .filter((item) => item._id === selectedOrder)
                .map((item) => {
                  const { formattedDate, formattedTime } = formatDateTime(item.createdAt);
                  return (
                    <Box key={item._id}>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ margin: 2, flex: 1, textAlign: 'center' }}>
                          โต๊ะ {item?.table_Id?.number || "ยังไม่เลือก"}
                        </Typography>
                        <Typography variant="h6" sx={{ margin: 2, flex: 1, textAlign: 'left' }}>
                          ออเดอร์ #{item?._id.substring(0, 6)}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ margin: 2, flex: 1, textAlign: 'right', fontSize: '0.875rem' }}
                        >
                          วันที่ {formattedDate} เวลา {formattedTime} น.
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ margin: 2 }}>สถานะออเดอร์ {translateStatus(item?.order_Status)}</Typography>
                      

                      <Typography variant="h6" sx={{ margin: 2 }}>รายการอาหาร</Typography>
                    </Box>
                  )
                })}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ลำดับ</TableCell>
                    <TableCell>ชื่ออาหาร</TableCell>
                    <TableCell>ราคา (บาท)</TableCell>
                    <TableCell>จำนวน</TableCell>
                    <TableCell>รวม (บาท)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderFoodDetails
                    .filter((item) => item.order_Id === selectedOrder)
                    .map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item?.food_Id?.food_Name}</TableCell>
                        <TableCell>{parseFloat(item.food_Id.food_Price.$numberDecimal)}</TableCell>
                        <TableCell>
                          <TextField
                            disabled
                            type="number"
                            size="small"
                            value={item?.orderDetail_Quantity}

                          // inputProps={{ min: 1 }}
                          />
                        </TableCell>
                        <TableCell>{parseFloat(item.food_Id.food_Price.$numberDecimal) * parseFloat(item?.orderDetail_Quantity)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ margin: 2 }}>รายเครื่องดื่ม</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ลำดับ</TableCell>
                    <TableCell>ชื่อเครื่องดื่ม</TableCell>
                    <TableCell>ราคา (บาท)</TableCell>
                    <TableCell>จำนวน</TableCell>
                    <TableCell>รวม (บาท)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orderDrinkDetails
                    .filter((item) => item.order_Id === selectedOrder)
                    .map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item?.drink_Id?.drink_Name}</TableCell>
                        <TableCell>{parseFloat(item.drink_Id?.drink_Price)}</TableCell>
                        <TableCell>
                          <TextField
                            disabled
                            type="number"
                            size="small"
                            value={item?.orderDetail_Quantity}
                          // inputProps={{ min: 1 }}
                          />
                        </TableCell>
                        <TableCell>{parseFloat(item.drink_Id?.drink_Price) * parseFloat(item?.orderDetail_Quantity)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>


            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              {payment
                .filter((item) => item.order_Id === selectedOrder)
                .map((item) => (
                  <Box key={item?.payment_Method}>
                    <Typography variant="h6">วิธีการชำระเงิน {(item?.payment_Method === 'cash')?("เงินสด"):("เงินโอน")}</Typography>
                  </Box>
                ))}

              <Typography variant="h6">รวมเงินทั้งหมด {paidAmount} บาท</Typography>
            </Box>


            {selectedOrder === null && (
              <Typography variant="h6" color="error">
                กรุณาเลือกรายการก่อน
              </Typography>
            )}


            {/* Confirm Button */}
          
            <SuccessAlertCashier successalert={alertSuccess} />
          </Box>
        </Box>)}
    </Container>
  );
};

export default CashierPaymentFinish;
