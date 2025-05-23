const multer = require('multer');
const path = require('path');

/**
 * Configure multer for memory storage (Buffer)
 */
const storage = multer.memoryStorage();

/**
 * Filter to only allow image files
 */
const fileFilter = (req, file, cb) => {
    // Check if file is an image
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

/**
 * Setup multer for single image upload
 */
const uploadSingle = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
}).single('image');

/**
 * Setup multer for multiple image upload
 */
const uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
    fileFilter: fileFilter
}).array('images', 10); // Max 10 images

/**
 * Middleware to handle single image upload
 */
exports.uploadImage = (req, res, next) => {
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            return res.status(400).json({
                success: false,
                message: `Multer error: ${err.message}`
            });
        } else if (err) {
            // Other errors
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Everything is fine
        next();
    });
};

/**
 * Middleware to handle multiple image upload
 */
exports.uploadImages = (req, res, next) => {
    uploadMultiple(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            return res.status(400).json({
                success: false,
                message: `Multer error: ${err.message}`
            });
        } else if (err) {
            // Other errors
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Everything is fine
        next();
    });
};
