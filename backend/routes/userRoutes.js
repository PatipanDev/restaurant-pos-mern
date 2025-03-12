const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole,logout} = require('../middlewares/authMiddleware');

// router.get('/admin', authenticateJWT, authorizeRole('owner'), (req, res) => {
//   res.status(200).json({
//     message: 'Welcome to the admin page'
//   });
// });

// router.get('/cashier', authenticateJWT, authorizeRole('cashier'), (req, res) => {
//   res.status(200).json({
//     message: 'Welcome to the cashier page'
//   });
// });

// router.get('/chef', authenticateJWT, authorizeRole('chef'), (req, res) => {
//   res.status(200).json({
//     message: 'Welcome to the chef page'
//   });
// });

router.get('/user', authenticateJWT, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the user page'
  });
});


router.post('/logout', logout); // กำหนด route สำหรับ logout



module.exports = router; // ส่ง router ออกมา