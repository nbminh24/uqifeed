const NutritionComment = require('../models/NutritionComment');

// Get all comments for a specific nutrition post
const getCommentsByNutritionId = async (req, res) => {
    try {
        const { nutritionId } = req.params;
        const comments = await NutritionComment.find({ nutritionId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching nutrition comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};

// Create a new comment
const createComment = async (req, res) => {
    try {
        const { nutritionId, content } = req.body;
        const userId = req.user.id; // From auth middleware

        const newComment = new NutritionComment({
            nutritionId,
            userId,
            content
        });

        const savedComment = await newComment.save();

        const populatedComment = await NutritionComment.findById(savedComment._id)
            .populate('userId', 'username');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error creating nutrition comment:', error);
        res.status(500).json({ message: 'Failed to create comment' });
    }
};

// Update a comment
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const comment = await NutritionComment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error('Error updating nutrition comment:', error);
        res.status(500).json({ message: 'Failed to update comment' });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await NutritionComment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await NutritionComment.findByIdAndDelete(id);

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting nutrition comment:', error);
        res.status(500).json({ message: 'Failed to delete comment' });
    }
};

module.exports = {
    getCommentsByNutritionId,
    createComment,
    updateComment,
    deleteComment
};
