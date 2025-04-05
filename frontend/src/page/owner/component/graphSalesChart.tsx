import React from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";

interface SalesChartProps {
  data: { date: string; totalSales: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  console.log("ค่าในคอมโพเน้น", data)
  return (
    <div style={{ width: "100%" }}>
      <ResponsiveChartContainer
        height={300}
        dataset={data}
        series={[{ type: "bar", dataKey: "totalSales", label: "Sales (฿)" }]}
        xAxis={[{ scaleType: "band", dataKey: "date" }]}
      >
        <BarPlot />
        <ChartsXAxis />
        <ChartsYAxis />
      </ResponsiveChartContainer>
    </div>
  );
};

export default SalesChart;
