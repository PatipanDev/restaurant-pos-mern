import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Home , ManageAccounts , ListAlt, RamenDining} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BottomNavigationComponent: React.FC = () => {
  // กำหนดค่าเริ่มต้นของ value ที่จะใช้กับ BottomNavigation
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);  // อัปเดตค่า value เมื่อมีการเปลี่ยนแปลง
      }}
      sx={{ width: '100%' }}  // สามารถใช้ sx เพื่อกำหนดขนาด
    >
      <BottomNavigationAction label="Home"  icon={<Home/>} component={Link} to="/home"/>
      <BottomNavigationAction label="Food" icon={<RamenDining /> }component={Link} to="/listfood" />
      <BottomNavigationAction label="Order" icon={<ListAlt />} component={Link} to="order" />
      <BottomNavigationAction label="profile" icon={<ManageAccounts/> } component={Link} to="profile"/>
    </BottomNavigation>
  );
}

export default BottomNavigationComponent;
