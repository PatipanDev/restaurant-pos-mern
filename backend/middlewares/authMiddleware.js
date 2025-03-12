const jwt = require('jsonwebtoken');

// Middleware สำหรับตรวจสอบ JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token; // ใช้คุกกี้ในการดึง token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }
    
    req.user = decoded; // เก็บข้อมูลผู้ใช้ที่ถูก decode มาใน req.user
    next(); // ถ้าผ่านการตรวจสอบ ให้ไปยัง route ถัดไป
  });
};

const logout = (req, res) => {
  try {
    // ลบ cookie ที่เก็บ JWT (token)
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

    // ส่งข้อความตอบกลับ
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};


module.exports = { authenticateJWT, logout};


