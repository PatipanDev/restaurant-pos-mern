import React, {  useState } from 'react';
import { Typography,  Tabs, Tab } from '@mui/material';


import EmOrderDetails from './componentEmployee/EmOrderDetails';
import EmOrderDetailsInprogress from './componentEmployee/EmOrderInProgress';
import EmOrderCompleted from './componentEmployee/EmOrderCompleted';
import EmOrderCancelled from './componentEmployee/EmOrderCancelled';

const OrderEmployee = () => {
  const [tabIndex, setTabIndex] = useState(0); // แท็บที่เลือก

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // ลบส่วนที่เกี่ยวข้องกับการอัปเดต URL ออก
  };


  // }
  return (
    <div>
      <>
        <Typography variant="h4" gutterBottom>รายการอาหารที่สั่งแล้ว</Typography>
        {/* Tabs */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="สั่งอาหาร" />
          <Tab label="กำลังดำเนินการ" />
          <Tab label="รายการที่สำเร็จ" />
          <Tab label="รายการที่ยกเลิก" />
        </Tabs>

        {tabIndex === 0 ? (
          <div>
            <EmOrderDetails />
          </div>
        ) : tabIndex === 1 ? (
          <div>
            <EmOrderDetailsInprogress/>
          </div>
        ) : tabIndex === 2 ? (
          <div>
            <EmOrderCompleted/>
          </div>
        ) : tabIndex === 3 ? (
          <div>
            <EmOrderCancelled/>
          </div>
        ) : (
          <div>ไม่มีเนื้อหา</div>
        )}
      </>
    </div>
  );
};

export default OrderEmployee;

