const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routes/todoHandler');
const cors = require('cors'); // Import CORS middleware

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Database connection with Mongoose
const mongoURI = 'mongodb://localhost/todos'; // MongoDB connection string
mongoose
    .connect(mongoURI)
    .then(() => console.log('Connected successfully to MongoDB'))
    .catch(err => console.log('Database connection error:', err));

// Application routes
app.use('/todo', todoHandler);

// Default error handler
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err.message });
}

// Use the error handler middleware
app.use(errorHandler);

// Listen on a specified port
const PORT = 3000; // Directly set the port number
app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});
