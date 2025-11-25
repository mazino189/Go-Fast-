const express = require('express');
const router = express.Router();
const { addCar, getAvailableCars, getCarById, updateCarLocation } = require('../controllers/carController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAvailableCars) 
    .post(protect, admin, addCar);
router.get('/available', getAvailableCars); // Anyone can see available cars

router.route('/:id')
    .get(getCarById);

router.route('/:id/location')
    .put(updateCarLocation); // In a real app, this might be protected differently

module.exports = router;