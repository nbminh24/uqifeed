const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { sendErrorResponse } = require('./utils/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
    origin: function (origin, callback) {
        // In development, allow these origins
        const allowedOrigins = ['http://localhost:19000',      // Expo development server
            'http://localhost:19006',      // Expo web
            'http://10.0.2.2:19000',      // Android emulator
            'exp://localhost:19000',       // Expo Go
            'http://10.0.0.233:19000',    // Old local network Expo server
            'exp://10.0.0.233:19000',     // Old local network Expo Go
            'http://10.0.146.10:19000',   // Updated local network Expo server
            'exp://10.0.146.10:19000',    // Updated local network Expo Go
            undefined,                     // Allow requests with no origin (like mobile apps)
            'null'                         // Allow requests from 'null' origin
        ];

        // Check if origin is allowed
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(null, true); // Still allow in development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Import routes
const indexRoutes = require('./routes/index');

// Use routes
app.use('/', indexRoutes);

// 404 handler
app.use((req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    sendErrorResponse(err, res);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
