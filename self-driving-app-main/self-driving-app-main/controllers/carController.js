const Car = require('../models/carModel');

// @desc    Add a new car
const addCar = async (req, res) => {
    try {
        const { make, model, year, licensePlate, autonomyLevel } = req.body;
        const car = new Car({ make, model, year, licensePlate, autonomyLevel });
        const createdCar = await car.save();
        res.status(201).json(createdCar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all available cars
const getAvailableCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get car by ID
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a car's location (simulation)
const updateCarLocation = async (req, res) => {
    try {
        const { longitude, latitude } = req.body;
        const car = await Car.findById(req.params.id);

        if (car) {
            car.currentLocation.coordinates = [longitude, latitude];
            const updatedCar = await car.save();
            res.json(updatedCar);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addCar, getAvailableCars, getCarById, updateCarLocation };