const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Notification = require('../models/notificationModel');
// Helper function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        console.log("--- ĐANG ĐĂNG KÝ ---");
        console.log("Data nhận được:", { name, email, password });

        // 1. Chuẩn hóa email (viết thường, bỏ khoảng trắng 2 đầu)
        email = email.toLowerCase().trim();

        // 2. Kiểm tra tồn tại
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Lỗi: Email đã tồn tại");
            return res.status(400).json({ message: 'Email này đã được sử dụng' });
        }

        // 3. Tạo user (Middleware pre-save trong Model sẽ tự mã hóa password)
        const user = await User.create({ name, email, password });

        if (user) {
        // tạo thông báo chào mừng sau khi đăng kí thành công
        await Notification.create({
            user: user._id,
            title: 'Chào mừng đến với GoFast! 🎉',
            message: `Xin chào ${user.name}, tài khoản ${user.email} đã được xác thực thành công.`,
            type: 'SYSTEM'
        });

        // 4. Phản hồi về client
            console.log("Đăng ký thành công cho:", user.email);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else { // Nếu tạo user thất bại
            console.log("Lỗi: Tạo user thất bại");
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        console.error("Lỗi Server (Register):", error.message);
        res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message });
    }
};

// @desc    Authenticate user & get token
const authUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        // 1. Chuẩn hóa email đầu vào
        email = email.toLowerCase().trim();

        console.log("--- ĐANG ĐĂNG NHẬP ---");
        console.log("Email tìm kiếm:", email);
        console.log("Password nhập vào:", password);

        // 2. Tìm user trong DB
        const user = await User.findOne({ email });

        if (!user) {
            console.log("KẾT QUẢ: Không tìm thấy email này trong Database");
            return res.status(401).json({ message: 'Email không tồn tại' });
        }

        console.log("Tìm thấy user:", user.name);
        console.log("Mật khẩu trong DB (Hash):", user.password);

        // 3. So sánh mật khẩu
        // Hàm matchPassword nằm trong userModel.js
        const isMatch = await user.matchPassword(password);
        
        console.log("Kết quả so sánh mật khẩu:", isMatch);

        if (isMatch) {
            console.log("=> ĐĂNG NHẬP THÀNH CÔNG!");
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            console.log("=> ĐĂNG NHẬP THẤT BẠI: Sai mật khẩu");
            res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
    } catch (error) {
        console.error("Lỗi Server (Login):", error.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// tạo thông báo chào mừng sau khi đăng kí hoặc là đăng nhập thành công


module.exports = { registerUser, authUser };