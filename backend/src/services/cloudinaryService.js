const cloudinary = require('../config/cloudinary');

class CloudinaryService {
    /**
     * Validates if a string is a valid base64 image
     * @param {String} str - String to validate
     * @returns {Boolean} True if valid base64 image
     */
    static isValidBase64Image(str) {
        if (!str) return false;

        // Check if it's a data URI
        if (str.startsWith('data:')) {
            const matches = str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) return false;

            // Verify mime type is an image
            const mimeType = matches[1].toLowerCase();
            if (!mimeType.startsWith('image/')) return false;

            // Verify base64 content
            const base64Data = matches[2]; try {
                const decoded = Buffer.from(base64Data, 'base64').toString('utf-8');
                return decoded.length > 0;
            } catch (e) {
                return false;
            }
        }

        // If it's raw base64, try to decode it
        try {
            const decoded = Buffer.from(str, 'base64').toString('utf-8');
            return decoded.length > 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * Upload an image to Cloudinary
     * @param {Buffer|String} file - File buffer or base64 string
     * @param {String} userId - User ID for folder organization
     * @param {Object} [options] - Additional upload options
     * @returns {Promise<Object>} Uploaded image information
     * @throws {Error} If file is invalid or upload fails
     */
    static async uploadImage(file, userId) {
        try {
            // Validate inputs
            if (!file) {
                throw new Error('No file provided for upload');
            }

            if (!userId) {
                throw new Error('User ID is required for upload');
            }

            // If file is too large (>10MB), throw error
            if (Buffer.isBuffer(file) && file.length > 10 * 1024 * 1024) {
                throw new Error('File size exceeds 10MB limit');
            }

            let uploadResult;
            const timestamp = new Date().getTime();
            const upload_options = {
                folder: `uqifeed/${userId}`,
                resource_type: 'image',
                transformation: [
                    { quality: 'auto:good' }, // Automatic quality optimization
                    { fetch_format: 'auto' }, // Automatic format optimization
                    { flags: 'preserve_transparency' }, // Preserve alpha channel
                    { format: 'auto' }, // Let Cloudinary choose best format
                    { width: 1200, crop: 'limit' } // Limit max width while maintaining aspect ratio
                ],
                overwrite: true, // Overwrite existing files
                public_id: `food_${timestamp}`, // Unique ID based on timestamp
                unique_filename: true, // Add unique suffix
                accessibility_analysis: true, // Get accessibility scores
                timeout: 60000 // 60 second timeout
            };

            // Handle different input types
            if (Buffer.isBuffer(file)) {
                // For buffer from multer
                const base64Data = file.toString('base64');
                const mimeType = 'image/jpeg'; // Default to JPEG for buffers
                uploadResult = await cloudinary.uploader.upload(
                    `data:${mimeType};base64,${base64Data}`,
                    upload_options
                );
            } else if (typeof file === 'string') {
                // Parse and validate base64
                let uploadData;
                if (file.startsWith('data:')) {
                    if (!this.isValidBase64Image(file)) {
                        throw new Error('Invalid base64 image data URI');
                    }
                    uploadData = file;
                } else {
                    if (!this.isValidBase64Image(file)) {
                        throw new Error('Invalid base64 image string');
                    }
                    uploadData = `data:image/jpeg;base64,${file}`;
                }

                // Validate data size before uploading
                const base64Size = Math.ceil((uploadData.length - uploadData.indexOf(',') - 1) * 0.75);
                if (base64Size > 10 * 1024 * 1024) { // 10MB limit
                    throw new Error('Base64 image size exceeds 10MB limit');
                }

                // Attempt upload with retries
                let attempts = 0;
                const maxAttempts = 3;
                while (attempts < maxAttempts) {
                    try {
                        uploadResult = await cloudinary.uploader.upload(uploadData, upload_options);
                        break;
                    } catch (error) {
                        attempts++;
                        if (attempts === maxAttempts) throw error;
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
                    }
                }
            } else {
                throw new Error('Unsupported file type. Must be Buffer or String');
            }

            return {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                width: uploadResult.width,
                height: uploadResult.height,
                format: uploadResult.format,
                size: uploadResult.bytes,
                resourceType: uploadResult.resource_type,
                createdAt: uploadResult.created_at
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            if (error.http_code) {
                // If it's a Cloudinary API error
                throw new Error(`Cloudinary upload failed: ${error.message} (HTTP ${error.http_code})`);
            }
            throw error; // Re-throw validation errors
        }
    }    /**
     * Delete an image from Cloudinary
     * @param {String} publicId - Cloudinary public ID of the image
     * @returns {Promise<Object>} Deletion result
     * @throws {Error} If deletion fails
     */
    static async deleteImage(publicId) {
        try {
            if (!publicId) {
                throw new Error('Public ID is required for deletion');
            }

            const result = await cloudinary.uploader.destroy(publicId, {
                invalidate: true // Invalidate CDN cache
            });

            if (result.result !== 'ok') {
                throw new Error(`Failed to delete image: ${result.result}`);
            }

            return {
                success: true,
                result: result.result
            };
        } catch (error) {
            console.error('Cloudinary deletion error:', error);
            if (error.http_code) {
                throw new Error(`Cloudinary deletion failed: ${error.message} (HTTP ${error.http_code})`);
            }
            throw error;
        }
    }

    /**
     * Delete multiple images from Cloudinary
     * @param {String[]} publicIds - Array of Cloudinary public IDs
     * @returns {Promise<Object>} Batch deletion results
     * @throws {Error} If batch deletion fails
     */
    static async deleteImages(publicIds) {
        try {
            if (!Array.isArray(publicIds) || publicIds.length === 0) {
                throw new Error('Array of public IDs is required for batch deletion');
            }

            const result = await cloudinary.api.delete_resources(publicIds, {
                invalidate: true
            });

            return {
                success: true,
                deleted: result.deleted,
                partial: result.partial,
                failed: result.failed
            };
        } catch (error) {
            console.error('Cloudinary batch deletion error:', error);
            if (error.http_code) {
                throw new Error(`Cloudinary batch deletion failed: ${error.message} (HTTP ${error.http_code})`);
            }
            throw error;
        }
    }

    /**
     * Get details about an uploaded image
     * @param {String} publicId - Cloudinary public ID of the image
     * @returns {Promise<Object>} Image details
     * @throws {Error} If fetching details fails
     */
    static async getImageDetails(publicId) {
        try {
            if (!publicId) {
                throw new Error('Public ID is required to get image details');
            }

            const result = await cloudinary.api.resource(publicId, {
                colors: true, // Get color information
                image_metadata: true, // Get EXIF data etc
                quality_analysis: true // Get quality scores
            });

            return {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                resourceType: result.resource_type,
                createdAt: result.created_at,
                width: result.width,
                height: result.height,
                size: result.bytes,
                colors: result.colors,
                predominant: result.predominant,
                metadata: result.image_metadata,
                quality: result.quality_analysis
            };
        } catch (error) {
            console.error('Cloudinary get image details error:', error);
            if (error.http_code) {
                throw new Error(`Failed to get image details: ${error.message} (HTTP ${error.http_code})`);
            }
            throw error;
        }
    }
}

module.exports = CloudinaryService;
