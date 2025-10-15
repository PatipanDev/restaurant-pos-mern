import React, {  useState } from 'react';
import { Typography, Tabs, Tab} from '@mui/material';
import ServFoodList from './componentEmployee/servFoodList';




const ServFood = () => {
  const [tabIndex, setTabIndex] = useState(0); // แท็บที่เลือก


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // ลบส่วนที่เกี่ยวข้องกับการอัปเดต URL ออก
  };

  return (
    <div>
      <>
        <Typography variant="h4" gutterBottom>รายการอาหารที่ต้องเสิร์ฟ</Typography>
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="รายการที่เสิร์พ" />
          <Tab label="ประวัติการเสิร์พ" />
        </Tabs>

        {tabIndex === 0 ? (
          <div>
            <ServFoodList/>
          </div>

        ) : tabIndex === 1 ? (
          <div>

          </div>
        ) : (
          <div>ไม่มีเนื้อหา</div>
        )}


      </>

    </div>
  );
};

export default ServFood;

