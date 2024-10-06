const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to the user.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Middleware to handle registration form submission
router.post('/register', (req, res, next) => {
    const { username, email, password, confirm_password, dob } = req.body;

 

    // Create a new user object with all fields
    const newUser = {
        username,
        email,
        password, // In a real app, hash the password before saving
        dob
    };

    // Read the existing users from user.json
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            const error = new Error('Error reading user data');
            error.status = 500;
            return next(error);
        }

        let users = [];
        if (data) {
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                const error = new Error('Error parsing user data');
                error.status = 500;
                return next(error);
            }
        }

        // Check if user already exists by email
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.status = 400;
            return next(error);
        }

        // Add the new user to the array
        users.push(newUser);

        // Write the updated users array back to user.json
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                const error = new Error('Error saving user data');
                error.status = 500;
                return next(error);
            }
            // Redirect to the profile page after successful registration
            res.redirect('/register_success');
        });
    });
});



router.post('/enroll', (req, res) => {
    const { userId, name, email, enrollmentDate, role } = req.body;

    // Here, save the enrollment to a database or file (for simplicity, a JSON file)
    const newUser = { userId, name, email, enrollmentDate, role };

    // Read current users
    const usersFilePath = path.join(__dirname, '../data/users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading users data' });
        }

        const users = JSON.parse(data);
        users.push(newUser);

        // Save updated users list
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Error saving enrollment data' });
            }
            res.json({ success: true });
        });
    });
});

module.exports = router;