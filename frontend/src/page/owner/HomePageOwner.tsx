const API_URL = import.meta.env.VITE_API_URL;
import { Box, AppBar, Toolbar, Typography, Divider } from '@mui/material';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart } from '@mui/x-charts/BarChart';


const HomePageOwner: React.FC = () => {
  const [chartData, setChartData] = useState<{ date: string; totalPaid: number }[]>([]);

  useEffect(() => {
    // ตรวจสอบว่าเคยเก็บข้อมูลไว้ใน sessionStorage หรือไม่
    const savedData = sessionStorage.getItem('salesData');
    
    if (savedData) {
      // ถ้ามีข้อมูลใน sessionStorage ให้ใช้ข้อมูลนั้น
      setChartData(JSON.parse(savedData));
    } else {
      // ถ้าไม่มีข้อมูลใน sessionStorage ให้ดึงข้อมูลจาก API
      axios.get(`${API_URL}/api/graph/getSalesDaily`)
        .then((res) => {
          const sorted = res.data.map((item: any) => ({
            date: item._id.date,
            totalPaid: item.totalPaid
          }));
          setChartData(sorted);
          // เก็บข้อมูลลง sessionStorage
          sessionStorage.setItem('salesData', JSON.stringify(sorted));
        })
        .catch((err) => console.error('Error fetching chart data:', err));
    }
  }, []);

  const xAxisLabels = chartData.map(item => item.date); // วันที่
  const seriesData = chartData.map(item => item.totalPaid); // ยอดเงิน

  return (
    <Box sx={{ height: 400, width: '80vw' }}>
      <BarChart
        width={1200}
        height={500}
        series={[{ data: seriesData, label: 'ยอดขาย 30 วันล่าสุด (บาท)' }]}
        xAxis={[{ data: xAxisLabels, scaleType: 'band' }]}
      />
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default HomePageOwner;
