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
    origin: ['http://10.0.118.219:19000', 'http://10.0.118.219:19001', 'http://10.0.118.219:19002', 'exp://10.0.118.219:19000'],
    credentials: true,
    origin: ['http://localhost:19000', 'http://localhost:19006', 'http://10.0.2.2:19000',
        'exp://localhost:19000', 'http://10.0.0.233:19000', 'exp://10.0.0.233:19000',
        'http://10.0.7.189:19000', 'exp://10.0.7.189:19000',
        'http://10.0.113.231:19000', 'exp://10.0.113.231:19000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['ETag'],
    maxAge: 0
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files
const path = require('path');
app.use('/static', express.static(path.join(__dirname, '../services')));
app.use('/static/text-mock.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, '../services/text-mock.jpg'));
});

// Import routes
const indexRoutes = require('./routes/index');
const testRoutes = require('./routes/test');
const foodHistoryRoutes = require('./routes/foodHistory');
const chatbotRoutes = require('./routes/chatbot');

// Use routes
app.use('/', indexRoutes);
app.use('/api/test', testRoutes);
app.use('/api/food-history', foodHistoryRoutes);
app.use('/api/chatbot', chatbotRoutes);

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
