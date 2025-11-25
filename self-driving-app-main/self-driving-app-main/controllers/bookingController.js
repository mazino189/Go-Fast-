const Booking = require('../models/bookingModel');
const Car = require('../models/carModel');
const Notification = require('../models/notificationModel'); 

// 1. Tạo đơn hàng
const createBooking = async (req, res) => {
    try {
        const { carId, startTime, endTime, paymentMethod, totalCost } = req.body;
        
        if (!carId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Thiếu thông tin đặt xe' });
        }

        const booking = new Booking({
            user: req.user._id,
            car: carId,
            startTime,
            endTime,
            totalCost,
            paymentMethod: paymentMethod || 'Tiền mặt',
            isPaid: paymentMethod !== 'Tiền mặt'
        });

        const createdBooking = await booking.save();

        // Tạo thông báo
        await Notification.create({
            user: req.user._id,
            title: 'Đặt xe thành công! 🚗',
            message: `Đơn hàng #${createdBooking._id.toString().slice(-6).toUpperCase()} đã được xác nhận.`,
            type: 'ORDER'
        });
        
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Lấy danh sách lịch sử
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('car', 'name imageUri pricePerDay')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 3. Lấy chi tiết đơn
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('car', 'name imageUri licensePlate pricePerDay details')
            .populate('user', 'name email'); 

        if (booking) {
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server' });
    }
};

// 4. Hủy đơn hàng (LOGIC TRỰC TIẾP TẠI ĐÂY)
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        if (!bookingId) {
            return res.status(400).json({ message: 'Thiếu ID đơn hàng' });
        }

        // 1. Tìm đơn hàng
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // 2. Kiểm tra quyền
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Bạn không có quyền hủy đơn này' });
        }

        // 3. Kiểm tra trạng thái
        if (booking.status !== 'Scheduled') {
            return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng đang chờ (Sắp tới)' });
        }

        // 4. Cập nhật trạng thái
        booking.status = 'Cancelled';
        await booking.save();

        // 5. Trả lại xe
        await Car.findByIdAndUpdate(booking.car, { isAvailable: true });

        // 6. Tạo thông báo
        await Notification.create({
            user: req.user._id,
            title: 'Đơn hàng đã hủy ❌',
            message: `Đơn hàng #${booking._id.toString().slice(-6).toUpperCase()} đã hủy thành công.`,
            type: 'SYSTEM'
        });

        res.json({ message: 'Hủy đơn hàng thành công' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server: ' + error.message });
    }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking };