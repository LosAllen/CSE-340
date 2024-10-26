const reviewModel = require('../models/review-model');
const utilities = require('../utilities');

/* ***************************
 *  Add Review
 * ************************** */
async function addReview(req, res, next) {
  const { inv_id, account_id, review_text, rating } = req.body;
  try {
    const review = await reviewModel.addReview(inv_id, account_id, review_text, rating);
    req.flash('notice', 'Review successfully added.');
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    req.flash('notice', 'Error adding review. Please try again.');
    res.status(500).redirect(`/inv/detail/${inv_id}`);
  }
}

/* ***************************
 *  Display Reviews for a Specific Inventory Item
 * ************************** */
async function getReviews(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  try {
    const reviews = await reviewModel.getReviewsByInventory(inv_id);
    res.json(reviews);
  } catch (error) {
    req.flash('notice', 'Error retrieving reviews. Please try again.');
    res.status(500).redirect(`/inv/detail/${inv_id}`);
  }
}

/* ***************************
 *  Update Review
 * ************************** */
async function updateReview(req, res, next) {
  const { review_id, review_text, rating } = req.body;
  try {
    const updatedReview = await reviewModel.updateReview(review_id, review_text, rating);
    req.flash('notice', 'Review successfully updated.');
    res.redirect(`/inv/detail/${updatedReview.inv_id}`);
  } catch (error) {
    req.flash('notice', 'Error updating review. Please try again.');
    res.status(500).redirect(`/inv/detail/${updatedReview.inv_id}`);
  }
}

/* ***************************
 *  Delete Review
 * ************************** */
async function deleteReview(req, res, next) {
  const review_id = parseInt(req.params.review_id);
  try {
    const deletedReview = await reviewModel.deleteReview(review_id);
    req.flash('notice', 'Review successfully deleted.');
    res.redirect(`/inv/detail/${deletedReview.inv_id}`);
  } catch (error) {
    req.flash('notice', 'Error deleting review. Please try again.');
    res.status(500).redirect(`/inv/detail/${deletedReview.inv_id}`);
  }
}

module.exports = {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
};
