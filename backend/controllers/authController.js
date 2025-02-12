const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ สมัครสมาชิก
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });

        await user.save();

        res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
};

// ✅ ล็อกอิน
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
};
