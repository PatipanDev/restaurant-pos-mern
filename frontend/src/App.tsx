import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { SyncLoader } from 'react-spinners';

//หน้าแรก
import HomeIndex from './page/Homeindex';
import Listfood from './page/Listfood';
// import FoodDetail from './page/FoodDetail';

import Login from './page/Login';
import Register from './page/Register';



import ProtectedRoute from './ProtectedRoute';
import LoginEmployee from './page/LoginEmployee';

// หน้าเจ้าของร้าน
import DashboardOwner from './page/owner/DashboardOwner';
import ProfileAdmin from './page/owner/Profileadmin';
import ManageEmployee from './page/owner/ManageEmployee';
import ManageCashier from './page/owner/ManageCashier';
import ManageProducts from './page/owner/ManageProducts';
import ManageProductCategories from './page/owner/ManageProductCategories';
import ManageUnits from './page/owner/ManageUnit';
import ManageTable from './page/owner/ManageTable';
import ManageDrinks from './page/owner/ManageDrink';
import ManageChefs from './page/owner/ManageChef';
import ManageFoods from './page/owner/ManageFoods';
import ManageShopOwners from './page/owner/ManageOwner';

import ManageFoods2 from './page/owner/ManageFoods2';

// หน้าเชฟ
import DashboardChef from './page/chef/DashboardChef';
import ProductChef from './page/chef/ManageProductsChef';
import ManageFoodsChef from './page/chef/ManageFoodsChef';
import HomePage from './page/Homepage';

// พนักงาน
import DashboardEmployee from './page/employee/DashboardEmployee';

//หน้าแคชเชียร์
import DashboardCashier from './page/cashier/DashboardCashier';




const App: React.FC = () => {
  const [_, setAuth] = useState<boolean>(false);

  return (
    <Router>
      {/* <HomePage/> */}
      <Suspense
        fallback={
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(5px)',
              zIndex: 9999,
            }}
          >
            <SyncLoader size={14} color="gray" />
          </Box>
        }
      >
        <Routes>

          {/* ล็อกอินและสมัครสมาชิก */}
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/loginemployee" element={<LoginEmployee setAuth={setAuth}/>} />
          <Route path="/register" element={<Register />} />


          <Route path="/" element={<HomePage />} />
          {/* ส่วนของหน้าลูกค้า */}
          <Route path="/home" element={<HomeIndex />} />
          <Route path="/listfood" element={<Listfood />} />
          {/* <Route path="/order" element={<ProtectedRoute requiredRole="user"><Order /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute requiredRole="user"><Profile /></ProtectedRoute>} /> */}
          {/* <Route path="/food-detail/:_id" element={<ProtectedRoute requiredRole="user"><FoodDetail /></ProtectedRoute>} /> */}
          {/* <Route path="/drink-detail/:_id" element={<ProtectedRoute requiredRole="user"><DrinkDetail /></ProtectedRoute>} /> */}



          {/* ส่วนของเจ้าของร้าน */}
          <Route path="/profileadmin" element={<ProfileAdmin />} />
          <Route path="/DashboardOwner" element={<DashboardOwner />} />
          <Route path="/manageemployee" element={<ManageEmployee />} />
          <Route path="/manageCashier" element={<ManageCashier />} />
          <Route path="/maageproductcategories" element={<ManageProductCategories />} />
          <Route path="/manageunit" element={<ManageUnits />} />
          <Route path="/managetable" element={<ProtectedRoute requiredRole="owner"><ManageTable /></ProtectedRoute>} />
          <Route path="/manageshopowners" element={<ProtectedRoute requiredRole="owner"><ManageShopOwners /></ProtectedRoute>} />
          <Route path="/manageproduct" element={<ProtectedRoute requiredRole="owner"><ManageProducts /></ProtectedRoute>} />
          <Route path="/managedrink" element={<ManageDrinks />} />
          <Route path="/managechef" element={<ManageChefs />} />
          <Route path="/managefoods" element={<ManageFoods />} />
          <Route path="/managefoods2" element={<ManageFoods2 />} />


          

          {/* ส่วนของเชฟ */}
          <Route path="/dashboardChef" element={<ProtectedRoute requiredRole="chef"><DashboardChef /></ProtectedRoute>} />
          <Route path="/productChef" element={<ProtectedRoute requiredRole="chef"><ProductChef /></ProtectedRoute>} />
          <Route path="/managefoodchef" element={<ProtectedRoute requiredRole="chef"><ManageFoodsChef /></ProtectedRoute>} />


          {/* ส่วนของพนักงาน */}
          <Route path="/DashboardEmployee" element={<ProtectedRoute requiredRole="employee"><DashboardEmployee /></ProtectedRoute>} />

          {/* ส่วนของแคชเชียร์  */}
          <Route path="/DashboardCashier" element={<ProtectedRoute requiredRole="cashier"><DashboardCashier /></ProtectedRoute>} />







        </Routes>

      </Suspense>
    </Router>
  )
}

export default App