const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities');

// Add a new review
router.post('/add', utilities.handleErrors(reviewController.addReview));

// Get all reviews for a specific inventory item (AJAX)
router.get('/get/:inv_id', utilities.handleErrors(reviewController.getReviews));

// Update a review
router.post('/edit', utilities.handleErrors(reviewController.updateReview));

// Delete a review
router.post('/delete/:review_id', utilities.handleErrors(reviewController.deleteReview));

module.exports = router;
