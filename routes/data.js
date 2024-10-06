const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Route to fetch course data
router.get('/Courses', (req, res) => {
    fs.readFile(path.join(__dirname, '../data/coursesData.json'), 'utf8', (err, data) => {
        if (req.err) {
            return res.status(500).json({ error: 'Error reading course data' });
        }
        res.json(JSON.parse(data));
    });
});

module.exports = router;
