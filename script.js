

// Sample code for user authentication and appointment management using Express.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/healthcare', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    // Add more user fields as needed
});
const User = mongoose.model('User', userSchema);

// Routes
app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});

app.post('/signin', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(404).send('User not found');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ username: user.username }, 'secret_key');
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error signing in');
    }
});

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/appointments', authenticateToken, (req, res) => {
    // Endpoint to create an appointment
});

app.get('/appointments', authenticateToken, (req, res) => {
    // Endpoint to retrieve appointments
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
