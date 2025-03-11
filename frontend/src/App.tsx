
import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { SyncLoader } from 'react-spinners';

import ProfileAdmin from './page/admin/Profileadmin';
import AddEmployee from './page/admin/AddEmployee';
import ManageCashier from './page/admin/ManageCashier';
import ManageProducts from './page/admin/ManageProducts';
import ManageProductCategories from './page/admin/ManageProductCategories';
import ManageUnits from './page/admin/ManageUnit';
import ManageTable from './page/admin/ManageTable';
import ManageDrinks from './page/admin/ManageDrink';
import ManageChefs from './page/admin/ManageChef';
import ManageFoods from './page/admin/ManageFoods';

import HomeIndex from './page/Homeindex';
import Dashboard from './page/Dashboard';
import Profile from './page/Profile';
import Listfood from './page/Listfood1';
import Order from './page/Oder';
import Login from './page/Login';
import Register from './page/Register';
import DashboardOwner from './page/admin/DashboardOwner';
import LoginReminder from './page/admin/component/LoginReminder';

import ProtectedRoute from './ProtectedRoute';
import ErrorBoundary from './page/ErrorBoundary';
import LoginEmployee from './page/LoginEmployee';


const HomePage = React.lazy(() => import('./page/Homepage'));


const App: React.FC = () => {
  const [isAuthenticated, setAuth] = useState<boolean>(false);


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
          {/* ส่วนของหน้าโชว์ตอนไม่มีการล็อกอิน */}
          <Route path="/loginreminder" element={<LoginReminder />} />

          {/* <RedirectBasedOnDevice />  */}
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />


          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomeIndex />} />
          <Route path="/listfood" element={<Listfood />} />
          <Route path="/order" element={<ProtectedRoute requiredRole="user"><Order /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute requiredRole="user"><Profile /></ProtectedRoute>} />




          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/loginemployee" element={<LoginEmployee setAuth={setAuth}/>} />
          <Route path="/profileadmin" element={<ProfileAdmin />} />

          <Route path="/admin/Dashboard" element={<Dashboard />} />
          <Route path="/DashboardOwner" element={<DashboardOwner />} />
          <Route path="/addemployee" element={<AddEmployee />} />

          <Route path="/manageCashier" element={<ManageCashier />} />

          <Route path="/maageproductcategories" element={<ManageProductCategories />} />
          <Route path="/manageunit" element={<ManageUnits />} />
          {/* <Route path="/managetable" element={<ManageTable />} /> */}
          <Route path="/managetable" element={<ProtectedRoute requiredRole="owner"><ManageTable /></ProtectedRoute>} />

          <Route path="/managedrink" element={<ManageDrinks />} />
          <Route path="/managechef" element={<ManageChefs />} />
          <Route path="/managefoods" element={<ManageFoods />} />

        </Routes>

      </Suspense>
    </Router>
  )
}

export default App