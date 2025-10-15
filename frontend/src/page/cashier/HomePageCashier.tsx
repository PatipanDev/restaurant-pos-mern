const API_URL = import.meta.env.VITE_API_URL;
import { Box, Divider } from '@mui/material';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart } from '@mui/x-charts/BarChart';



const HomePageCashier: React.FC = () => {
  const [chartData, setChartData] = useState<{ date: string; totalPaid: number }[]>([]);
  const [buyData, setBuyData] = useState<{date: string; totalPaid: number }[]>([]);


  useEffect(() => {
    const graphData = sessionStorage.getItem('graphData');
  
    if (graphData) {
      const oldData = (JSON.parse(graphData));
      setChartData(oldData.sorted)
      setBuyData(oldData.buyproduct)
      return; // ✅ หยุดการทำงานหลังใช้ข้อมูลจาก sessionStorage แล้ว
    }
  
    // ถ้าไม่มีข้อมูลใน sessionStorage ให้ดึงจาก API
    axios.get(`${API_URL}/api/graph/getSalesDaily`)
      .then((res) => {
        console.log(res.data);
  
        const sorted = res.data.salesData.map((item: any) => ({
          date: item._id.date,
          totalPaid: item.totalPaid,
        }));
        setChartData(sorted);

        const buyproduct = res.data.buyData.map((item: any) => ({
          date: item._id,
          totalPaid: item.totalAmount,
        }));
        setBuyData(buyproduct);
  
        const product = res.data.productData.map((item: any) => ({
          product_Name: item.product_Name,
          product_Stock: item.product_Stock,
          product_Quantity: item.product_Quantity,
        }));
  
        const food = res.data.foodData.map((item: any) => ({
          food_Name: item.food_Name,
          food_Stock: item.food_Stock,
        }));
  
        const drink = res.data.drinkData.map((item: any) => ({
          drink_Name: item.drink_Name,
          drink_Stock_quantity: item.drink_Stock_quantity,
        }));
        const graphData ={
          sorted,
          buyproduct,
          product,
          food,
          drink
        }
  
        sessionStorage.setItem('graphData', JSON.stringify(graphData));
      })
      .catch((err) => console.error('Error fetching chart data:', err));
  }, []);


  const xAxisLabels = chartData.map(item => item.date); // วันที่
  const seriesData = chartData.map(item => item.totalPaid); // ยอดเงิน

  const buyLabels = buyData.map(item => item.date); // วันที่
  const buyDatas = buyData.map(item => item.totalPaid); // ยอดเงิน




  return (
    <Box sx={{ height: 400, width: '80vw' }}>
      <BarChart
        width={1200}
        height={500}
        series={[{ data: seriesData, label: 'ยอดขาย 30 วันล่าสุด (บาท)',color: '#32CD32' }]}
        xAxis={[{ data: xAxisLabels, scaleType: 'band' }]}
      />
       <BarChart
        width={1200}
        height={500}
        series={[{ data: buyDatas, label: 'ยอดที่ซื้อ 30 วันล่าสุด (บาท)',color: '#FFF333' }]}
        xAxis={[{ data: buyLabels, scaleType: 'band' }]}
      />
      <Divider sx={{ my: 2 }} />
      {/* <Box sx={{ height: 400, width: '80vw', marginBottom: 20}}>
        <BarChart
          width={1200}
          height={500}
          series={[
            { data: stockData, label: 'สินค้าคงเหลือ' },
            { data: quantityData, label: 'ที่ใช้ไป' }
          ]}
          xAxis={[{ data: productLabels, scaleType: 'band' }]}
        />
        <Divider sx={{ my: 2 }} />
      </Box>
      <BarChart
          width={1200}
          height={500}
          series={[
            { data: foodStock, label: 'อาหารคงเหลือ' ,color: '#FFCC33'}
          ]}
          xAxis={[{ data: foodLabels, scaleType: 'band' }]}
        />
         <Divider sx={{ my: 2 }} />
        <BarChart
          width={1200}
          height={500}
          series={[
            { data: drinkStock, label: 'เครื่องดื่มคงเหลือ', color:'#3366FF' }
          ]}
          xAxis={[{ data: drinkLabels, scaleType: 'band' }]}
        /> */}
        <Divider sx={{ my: 2 }} />

    </Box>
  );
};

export default HomePageCashier;
