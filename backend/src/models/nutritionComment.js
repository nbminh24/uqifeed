/**
 * Nutrition Comment Model
 * Model for storing nutrition comments in the database
 */
const mongoose = require('mongoose');

const nutritionCommentSchema = new mongoose.Schema({
    nutritionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutrition',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
nutritionCommentSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

const NutritionComment = mongoose.model('NutritionComment', nutritionCommentSchema);

module.exports = NutritionComment;
