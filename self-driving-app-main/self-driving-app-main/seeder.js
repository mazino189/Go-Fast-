const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const cars = require('./data/cars');
const User = require('./models/userModel');
const Car = require('./models/carModel');
const Booking = require('./models/bookingModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // 1. Xóa sạch dữ liệu cũ
        await Booking.deleteMany();
        await Car.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...');

        // 2. Tạo Users (SỬA LỖI Ở ĐÂY)
        // Thay vì insertMany, ta dùng vòng lặp để create từng người
        // Điều này giúp kích hoạt middleware mã hóa mật khẩu trong userModel
        const createdUsers = [];
        for (const user of users) {
            const newUser = await User.create(user);
            createdUsers.push(newUser);
        }
        
        // Lấy ID của admin (người đầu tiên)
        const adminUser = createdUsers[0]._id;

        // 3. Tạo Cars
        // Nếu muốn gắn xe vào admin, có thể map lại (tùy chọn)
        const sampleCars = cars.map((car) => {
            return { ...car, user: adminUser };
        });
        
        await Car.insertMany(sampleCars);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Booking.deleteMany();
        await Car.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}