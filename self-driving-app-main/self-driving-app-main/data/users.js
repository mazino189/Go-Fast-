const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123', // Password chưa hash, Model sẽ tự hash
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
        isAdmin: false,
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '123',
        isAdmin: false,
    },
];

module.exports = users;