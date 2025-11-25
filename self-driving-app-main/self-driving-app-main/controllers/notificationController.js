const Notification = require('../models/notificationModel');

// @desc    Lấy danh sách thông báo của tôi
// @route   GET /api/notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 }); // Mới nhất lên đầu
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server' });
    }
};

module.exports = { getMyNotifications };