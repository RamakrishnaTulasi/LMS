const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFilePath = path.join(__dirname, '../data/users.json');


// Path to the user.json file
router.post('/login', (req, res, next) => {
    let { email, password } = req.body;

    // Trim whitespace and convert email to lowercase for uniformity
    email = email.trim().toLowerCase();

    // Check if the email and password fields are filled
    if (!email || !password) {
        const error = new Error('Please fill in both email and password');
        error.status = 400; // Bad request
        return next(error);
    }

    // Read the existing users from user.json
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            const error = new Error('Error reading user data');
            error.status = 500; // Internal Server Error
            return next(error); // Forward to error-handling middleware
        }

        let users = [];
        if (data) {
            try {
                users = JSON.parse(data); // Parse existing users
            } catch (parseError) {
                const error = new Error('Error parsing user data');
                error.status = 500;
                return next(error);
            }
        }

        // Check if the user exists by email
        const existingUser = users.find(user => user.email === email);

        // If the user doesn't exist, raise an error with 404 status
        if (!existingUser) {
            const error = new Error('User with this email does not exist. Please register.');
            error.status = 404; // Not found
            return next(error);
        }

        // Check if the password matches (in a real app, use hashed password comparison)
        if (existingUser.password !== password) {
            const error = new Error('Incorrect password');
            error.status = 401; // Unauthorized
            return next(error);
        }

        // Store user information in session
        req.session.userId = existingUser.email; // Store user ID or email
        req.session.user = existingUser;

        // Redirect to the dashboard
        return res.redirect('/user/dashboard');
    });
});


// Dashboard route
router.get('/dashboard', (req, res) => {
   
    // Check if user is authenticated
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.render('user/dashboard', { user: req.session.user });
});

router.get('/profile', (req, res)=>{

    // Check if user is authenticated
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.render('user/profile', { user: req.session.user });
})

// Logout route
router.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Could not log out. Please try again.");
        }

        // Redirect to login page or home page after logout
        res.redirect('/login');
    });
});

module.exports = router;