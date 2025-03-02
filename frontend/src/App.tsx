import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNavigationComponent from './components/BottomNavigation';
import Paper from '@mui/material/Paper';
import Home from './page/Home';
import Listfood from './page/Listfood';
import Order from './page/Order';
import Profile from './page/Profile';
import LoadingPage from './page/LoadingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage/>}/>
        <Route path="/home" element={<Home/>} />
        <Route path="/listfood" element={<Listfood/>} />
        <Route path="/order" element={<Order/>} />
        <Route path="/profile" element={<Profile/>}></Route>
      </Routes>
      
      <Paper sx={{position: 'fixed', bottom: 0, left: 0,right:0}} elevation={4}>
          <BottomNavigationComponent />
        </Paper>
    </Router>

  );
};

export default App;
