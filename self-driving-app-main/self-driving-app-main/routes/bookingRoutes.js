const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getMyBookings, 
    getBookingById, 
    cancelBooking 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// 1. Tạo đơn
router.route('/').post(protect, createBooking);

// 2. Hủy đơn (POST /cancel) - Đặt lên trên
router.post('/cancel', protect, cancelBooking);

// 3. Lấy danh sách
router.route('/mybookings').get(protect, getMyBookings);

// 4. Lấy chi tiết (Đặt cuối cùng)
router.route('/:id').get(protect, getBookingById);

module.exports = router;