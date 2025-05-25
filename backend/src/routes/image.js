const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const imageController = require('../controllers/image');

// Routes
router.post(
    '/upload-and-process',
    authenticate,
    imageController.uploadAndProcessImage
);

router.get(
    '/',
    authenticate,
    imageController.getUserImages
);

router.get(
    '/:id',
    authenticate,
    imageController.getImageById
);

module.exports = router;
