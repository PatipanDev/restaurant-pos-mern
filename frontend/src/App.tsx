
import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { SyncLoader } from 'react-spinners';


import Dashboard from './page/admin/Dashboard';
import ProfileAdmin from './page/admin/Profileadmin';
import AddEmployee from './page/admin/AddEmployee';
import ManageCashier from './page/admin/ManageCashier';
import ManageProducts from './page/admin/ManageProducts';
import ManageProductCategories from './page/admin/ManageProductCategories';
import ManageUnits from './page/admin/ManageUnit';


const Home = React.lazy(() => import('./page/Home'));
const Listfood = React.lazy(() => import('./page/Listfood'));
const Order = React.lazy(() => import('./page/Order'));
const Profile = React.lazy(() => import('./page/Profile'));
const Login = React.lazy(() => import('./page/Login'));
const Register = React.lazy(() => import('./page/Register'));
const LoginEmployee = React.lazy(() => import('./page/LoginEmployee'));



const App = () => {

  return (
    <Router>
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
              <Route path="/profileadmin" element={<ProfileAdmin/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home/>} />
              <Route path="/listfood" element={<Listfood />} />
              <Route path="/order" element={<Order />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/loginemployee" element={<LoginEmployee />} />
              <Route path="/admin/Dashboard" element={<Dashboard/>} />
              <Route path="/addemployee" element={<AddEmployee/>} />
              <Route path="/manageCashier" element={<ManageCashier/>}/>
              <Route path="/manageproduct" element={<ManageProducts/>}/>
              <Route path="/maageproductcategories" element={<ManageProductCategories/>}/>
              <Route path="/manageunit" element={<ManageUnits/>}/>
            </Routes>
          </Suspense>
        </Router>
  )
}

export default App