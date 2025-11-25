const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    licensePlate: { 
        type: String,
        required: true,
        unique: true
    },

    // Storing price as a Number is better for calculations, sorting, and filtering.
    // The 'VND' and formatting should be handled by the frontend.
    pricePerDay: { 
        type: Number, 
        required: true 
    },
    pricePerHour: { 
        type: Number, 
        required: true 
    },
    discount: { 
        type: String, 
        default: '' 
    },
    imageUri: { 
        type: String, 
        required: true 
    },

    // Using an enum to restrict the values to your specified types.
    type: { 
        type: String, 
        enum: ['4 chỗ', '7 chỗ', '9 chỗ'], 
        required: true 
    },
    details: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5
    },
    trips: { 
        type: Number, 
        default: 0 
    },
    avatarUri: { 
        type: String 
    },
    // We can keep this field from the old model to track availability.
    isAvailable: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;