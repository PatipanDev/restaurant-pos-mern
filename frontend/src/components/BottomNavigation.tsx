import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Home , ManageAccounts , ListAlt, RamenDining} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MyPage: React.FC = () => {
  // กำหนดค่าเริ่มต้นของ value ที่จะใช้กับ BottomNavigation
  const [value, setValue] = React.useState(0);

  return (
    <>
      <div>
        {/* ส่วนของคอนเทนต์ในหน้าปัจจุบัน */}
        <h1>Welcome to MyPage</h1>
        {/* คุณสามารถใส่คอนเทนต์อื่นๆ ได้ที่นี่ */}
      </div>

      {/* ส่วนของเมนูข้างล่าง */}
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);  // อัปเดตค่า value เมื่อมีการเปลี่ยนแปลง
        }}
        sx={{ width: '100%' }}  // สามารถใช้ sx เพื่อกำหนดขนาด
      >
        <BottomNavigationAction label="Home"  icon={<Home/>} component={Link} to="/home"/>
        <BottomNavigationAction label="Food" icon={<RamenDining /> } component={Link} to="/listfood" />
        <BottomNavigationAction label="Order" icon={<ListAlt />} component={Link} to="/order"/> 
        <BottomNavigationAction label="Profile" icon={<ManageAccounts/> } component={Link} to="/profile"/>
      </BottomNavigation>
    </>
  );
}

export default MyPage;

