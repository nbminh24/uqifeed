const NutritionComment = require('../models/nutritionComment');
const { db } = require('../config/firebase');

// Get all comments for a specific nutrition post
const getCommentsByNutritionId = async (req, res) => {
    try {
        const { nutritionId } = req.params;

        // Query comments by food_id instead of nutritionId
        const commentsSnapshot = await db.collection('nutrition_comments')
            .where('food_id', '==', nutritionId)
            .get();

        const comments = [];
        commentsSnapshot.forEach(doc => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by created_at timestamp in descending order
        comments.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

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

        // Parse the content if it's JSON
        let parsedContent;
        try {
            parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        } catch (e) {
            parsedContent = { nutrition_comment: content };
        }

        const commentData = {
            food_id: nutritionId,
            target_nutrition_id: parsedContent.target_nutrition_id || '',
            nutrition_type: parsedContent.nutrition_type || 'General',
            nutrition_delta: parsedContent.nutrition_delta || 0,
            nutrition_comment: parsedContent.nutrition_comment || content,
            icon: parsedContent.icon || '💬',
            meal_type: parsedContent.meal_type || 'general'
        };

        const nutritionComment = new NutritionComment(commentData);
        const savedComment = await nutritionComment.save();

        res.status(201).json(savedComment);
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

        // Get the comment document
        const commentDoc = await db.collection('nutrition_comments').doc(id).get();

        if (!commentDoc.exists) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const comment = commentDoc.data();

        // Since we're using a different structure, we need to determine ownership differently
        // For now, skip ownership check as we migrate, or implement it using the new data structure

        // Update the comment
        let updatedData = {};

        // Parse the content if it's JSON
        try {
            const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
            updatedData = {
                nutrition_comment: parsedContent.nutrition_comment || parsedContent,
                updated_at: new Date().toISOString()
            };
        } catch (e) {
            updatedData = {
                nutrition_comment: content,
                updated_at: new Date().toISOString()
            };
        }

        await db.collection('nutrition_comments').doc(id).update(updatedData);

        // Get the updated comment
        const updatedCommentDoc = await db.collection('nutrition_comments').doc(id).get();

        res.status(200).json({
            id: updatedCommentDoc.id,
            ...updatedCommentDoc.data()
        });
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

        // Get the comment document
        const commentDoc = await db.collection('nutrition_comments').doc(id).get();

        if (!commentDoc.exists) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Since we're using a different structure, we need to determine ownership differently
        // For now, skip ownership check as we migrate, or implement it using the new data structure

        // Delete the comment
        await db.collection('nutrition_comments').doc(id).delete();

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
