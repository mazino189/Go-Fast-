const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Scheduled', 'Active', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    paymentMethod: { type: String, default: 'Tiền mặt' }, // Mới
    isPaid: { type: Boolean, default: false }             // Mới
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);