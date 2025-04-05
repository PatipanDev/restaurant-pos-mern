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
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider, IconButton,
  dividerClasses
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
import { number } from 'yup';
import { formatDateTime } from "../../utils/formatDateTime";
import { error } from "console";

import Receipt from "./component/Receipt";
import { getEmployeeId } from "../../utils/userUtils";
import SuccessAlertCashier from "../../components/AlertSussessCashier";

const cashier_Id = getEmployeeId()

const CashierPayment: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFoodDetails, setOrderFoodDetails] = useState<any[]>([]);
  const [orderDrinkDetails, setOrderDrinkDetails] = useState<any[]>([]);
  const [payment, setPayment] = useState<any[]>([])
  const [datarecipt, setDatarecipt] = useState<any>()
  const [idrecipt, setIdrecipt] = useState<string>("")

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState<number | "">("");
  const [changeAmount, setchangeAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const [alertSuccess, setAlertSuccess] = useState<React.ReactNode | null>(null);


  // เมื่อเลือกรายการอาหาร
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // ใช้เก็บค่า query ค้นหาจากผู้ใช้ 

  useEffect(() => {
    fetchListOrder();
  }, [])

  const fetchListOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/food/getpaymentorderByCashier`);
      setDatarecipt(response.data)
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

  useEffect(() => {
    const change = typeof cashReceived === "number" ? cashReceived - paidAmount : 0; // ตรวจสอบ cashReceived ว่าเป็น number
    setchangeAmount(change)
  }, [cashReceived])
  // setCashReceived(change);

  const handlePayment = async (id: string) => {
    if (paymentMethod === "cash" && (typeof cashReceived !== "number" || cashReceived < paidAmount)) {
      alert("กรุณารับเงินให้เพียงพอ");
      return;
    } else {
      const isConfirmed = window.confirm("คุณต้องการยืนยันการชำระเงิมใช่หรือไม่");
      if (!isConfirmed) {
        console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
        return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
      }


      let newcashReceived: number | "" = 0
      let newchangeAmount: number | "" = 0
      if (paymentMethod === "cash") {
        newcashReceived = cashReceived
        newchangeAmount = changeAmount
      }
      try {
        const newData = {
          payment_Method: paymentMethod,
          received_Amount: newcashReceived,
          change_Amount: newchangeAmount,
          paid_Amount: paidAmount,
          cashier_Id: cashier_Id
        }
        console.log(newData)
        const response = await axios.put(`${API_URL}/api/food/updatePaymentCutomer/${id}`, { newData });
        console.log(response.data)
        if (response.status === 200) {
          setAlertSuccess(<div>ชำระเงินสำเร็จ</div>)
          setTimeout(()=>{
            fetchListOrder();
          }, 2000)
        }
      } catch (error) {

      }
    }
  };

  // handlePaymentAndReceipt
  const handlePaymentAndReceipt = async (id: string) => {
    if (paymentMethod === "cash" && (typeof cashReceived !== "number" || cashReceived < paidAmount)) {
      alert("กรุณารับเงินให้เพียงพอ");
      return;
    } else {
      const isConfirmed = window.confirm("คุณต้องการยืนยันการชำระเงิมใช่หรือไม่");
      if (!isConfirmed) {
        console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
        return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
      }


      let newcashReceived: number | "" = 0
      let newchangeAmount: number | "" = 0
      if (paymentMethod === "cash") {
        newcashReceived = cashReceived
        newchangeAmount = changeAmount
      }
      try {
        const newData = {
          payment_Method: paymentMethod,
          received_Amount: newcashReceived,
          change_Amount: newchangeAmount,
          paid_Amount: paidAmount,
          cashier_Id: cashier_Id
        }
        console.log(newData)
        const response = await axios.put(`${API_URL}/api/food/updatePaymentCutomer/${id}`, { newData });
        console.log(response.data)
        if (response.status === 200) {
          setAlertSuccess(<div>ชำระเงินสำเร็จ</div>)
          setTimeout(()=>{
            fetchListOrder();
          }, 2000)
          setIdrecipt(response.data.receipt_Id)
          console.log("รหัสไอดี", response.data.receipt_Id)
        }
      } catch (error) {

      }
    }
  };
  //เมื่อเลือกรายการ
  const handleClickSelect = (id: any) => {
    setSelectedOrder(id)
    setchangeAmount(0)
    setCashReceived("")
  }

  const handleRefresh = () => {
    fetchListOrder();
  };

  const handdlecloseDetail = () => {
    setIdrecipt(""); // ปิด Modal
  };

  //จะทำการบันทึค่าทุกครั้งที่มีการเปลี่ยน
  const handleQuantityChangelistfood = async (_id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const isConfirmed = window.confirm("คุณต้องการยืนยันว่าทำอาหารเสร็จใช่หรือไม่?");
      if (!isConfirmed) {
        console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
        return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
      }
    }
    try {
      // ส่งคำขอ PUT ไปยัง API เพื่ออัพเดตข้อมูลจำนวนของรายการ
      const response = await axios.put(`${API_URL}/api/food/updateQuantityFood/${_id}`, {
        orderDetail_Quantity: newQuantity,
      });

      // ตรวจสอบว่าการอัพเดตสำเร็จ
      if (response.status === 200) {
        // ตรวจสอบว่า response.data มีข้อมูลที่ต้องการหรือไม่
        console.log('Updated order:', response.data);

        // ใช้ setOrders เพียงครั้งเดียวเพื่ออัพเดตข้อมูลใหม่
        if (newQuantity <= 0) {
          setOrderFoodDetails(prevOrders => prevOrders.filter(order => order._id !== _id));
        } else {
          // ถ้าจำนวนมากกว่า 0 ให้ทำการอัพเดต
          setOrderFoodDetails(prevOrders =>
            prevOrders.map(order =>
              order._id === _id ? { ...order, orderDetail_Quantity: newQuantity } : order
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // จัดการกรณีข้อผิดพลาด เช่น แสดงข้อความผิดพลาด
    }
  };

  const handleQuantityChangelistdrink = async (_id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const isConfirmed = window.confirm("คุณต้องการที่จะลบรายการใช่หรือไม่?");
      if (!isConfirmed) {
        console.log("ผู้ใช้ยกเลิกการยืนยันคำสั่งซื้อ");
        return; // ถ้าผู้ใช้ยกเลิก ก็จะไม่ทำอะไร
      }
    }
    try {
      // ส่งคำขอ PUT ไปยัง API เพื่ออัพเดตข้อมูลจำนวนของรายการ
      const response = await axios.put(`${API_URL}/api/food/updateQuantityDrink/${_id}`, {
        orderDetail_Quantity: newQuantity,
      });

      // ตรวจสอบว่าการอัพเดตสำเร็จ
      if (response.status === 200) {
        // ตรวจสอบว่า response.data มีข้อมูลที่ต้องการหรือไม่
        console.log('Updated order:', response.data);

        // ใช้ setOrders เพียงครั้งเดียวเพื่ออัพเดตข้อมูลใหม่
        if (newQuantity <= 0) {
          setOrderDrinkDetails(prevOrders => prevOrders.filter(order => order._id !== _id));
        } else {
          // ถ้าจำนวนมากกว่า 0 ให้ทำการอัพเดต
          setOrderDrinkDetails(prevOrders =>
            prevOrders.map(order =>
              order._id === _id ? { ...order, orderDetail_Quantity: newQuantity } : order
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // จัดการกรณีข้อผิดพลาด เช่น แสดงข้อความผิดพลาด
    }
  };

  return (
    <Container maxWidth={false} sx={{ height: "100vh", width: "80vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {idrecipt ? (
        <div>
          {idrecipt && <Receipt id={idrecipt} onClose={handdlecloseDetail} />}
        </div>
      ) : (
        <Box sx={{ width: "100%", height: "90%", display: "flex" }}>
          {/* Order List on the Left */}
          <Box sx={{ width: "30%", overflowY: "auto", p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              รายการที่ต้องชำระเงิน
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
                    primary={`ออเดอร์ #${item?._id.substring(0, 6)} - โต๊ะหมายเลข ${item.table_Id?.number}`}
                    secondary={`ลูกค้า: ${item?.customer_Id?.customer_Name} | พนักงาน: ${item?.employee_Id?.employee_Name || "ยังไม่ยืนยันออเดอร์"}`}
                  />
                </ListItemButton>
              ))}

            </List>
          </Box>

          {/* Table and Payment on the Right */}
          <Box sx={{ width: "70%", p: 2 }}>
            {/* Table: Order List */}
            <TableContainer component={Paper} sx={{ maxHeight: "60%", overflowY: "auto" }}>
              {orders
                .filter((item) => item._id === selectedOrder)
                .map((item, index) => {
                  const { formattedDate, formattedTime } = formatDateTime(item.createdAt);
                  return (
                    <Box key={item._id}>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ margin: 2, flex: 1, textAlign: 'center' }}>
                          โต๊ะ {item?.table_Id?.number}
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
                            type="number"
                            size="small"
                            value={item?.orderDetail_Quantity}
                            onChange={(e) => handleQuantityChangelistfood(item._id, Number(e.target.value))}
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
                            type="number"
                            size="small"
                            value={item?.orderDetail_Quantity}
                            onChange={(e) => handleQuantityChangelistdrink(item._id, Number(e.target.value))}
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
              <Box>
                <Typography variant="h6">วิธีการชำระเงิน</Typography>
                <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <FormControlLabel value="cash" control={<Radio />} label="เงินสด" />
                  <FormControlLabel value="transfer" control={<Radio />} label="เงินโอน" />
                </RadioGroup>
              </Box>

              <Typography variant="h6">รวมเงินทั้งหมด {paidAmount} บาท</Typography>
            </Box>




            {/* Cash Input */}
            {paymentMethod === "cash" && (
              <TextField
                label="รับเงิน (บาท)"
                type="number"
                fullWidth
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value ? Number(e.target.value) : "")}
                sx={{ my: 2 }}
              />
            )}

            {/* Change Display */}
            {paymentMethod === "cash" && cashReceived !== "" && (

              <Typography variant="h6" color={changeAmount >= 0 ? "green" : "red"}>
                เงินทอน: {changeAmount >= 0 ? changeAmount : "เงินไม่พอ"} บาท
              </Typography>
            )}

            {selectedOrder === null && (
              <Typography variant="h6" color="error">
                กรุณาเลือกรายการก่อน
              </Typography>
            )}


            {/* Confirm Button */}
            {orders
              .filter((item) => item._id === selectedOrder)
              .map((item, index) => (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }} key={item._id}>

                  {/* Confirm Button */}
                  <Button variant="contained" color="primary" sx={{ flex: 1 }} onClick={() => handlePaymentAndReceipt(item._id)}>
                    ใบเสร็จ
                  </Button>


                  <Button
                    // เปลี่ยน ker เป็น key
                    variant="contained"
                    color="primary"
                    sx={{ flex: 1 }}
                    onClick={() => handlePayment(item._id)}
                  >
                    ยืนยันการชำระเงิน
                  </Button>
                  <SuccessAlertCashier successalert={alertSuccess} />

                </Box>
              ))}
          </Box>
        </Box>)}
    </Container>
  );
};

export default CashierPayment;
