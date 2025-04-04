const API_URL = import.meta.env.VITE_API_URL;
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";
import axios from "axios";
import SalesChart from './component/graphSalesChart';


interface SalesData {
    date: string;
    totalSales: number;
}

const HomePageOwner: React.FC = () => {
    const [salesData, setSalesData] = useState<SalesData[]>([]);

      useEffect(() => {
        axios.get(`${API_URL}/api/graph/getSalesDaily`)
          .then((response) => {
            console.log(response.data)
            const currentMonth = new Date().getMonth() + 1; // เดือนปัจจุบัน (1-12)
            const currentYear = new Date().getFullYear(); // ปีปัจจุบัน
    
            const filteredData = response.data
              .map((item: any) => ({
                date: item._id.date,
                totalSales: item.totalSales
              }))
              .filter(({ date }: SalesData) => {
                const [year, month] = date.split("-").map(Number);
                return year === currentYear && month === currentMonth;
              });
    
            setSalesData(filteredData);
          })
          .catch((error) => console.error("Error fetching sales data:", error));
      }, []);

  return (
    <Box style={{ height: '90vh', width: '80vw' }}>
        <SalesChart data={salesData} />
    </Box>
  );
};

export default HomePageOwner;
