const pool = require('../database');

async function addReview(inv_id, account_id, review_text, rating) {
  try {
    const sql = `
      INSERT INTO reviews (inv_id, account_id, review_text, rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(sql, [inv_id, account_id, review_text, rating]);
    return result.rows[0];
  } catch (error) {
    console.error('addReview Error:', error);
    throw error;
  }
}

async function getReviewsByInventory(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC;
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error('getReviewsByInventory Error:', error);
    throw error;
  }
}

async function updateReview(review_id, review_text, rating) {
  try {
    const sql = `
      UPDATE reviews
      SET review_text = $1, rating = $2, review_date = CURRENT_TIMESTAMP
      WHERE review_id = $3
      RETURNING *;
    `;
    const result = await pool.query(sql, [review_text, rating, review_id]);
    return result.rows[0];
  } catch (error) {
    console.error('updateReview Error:', error);
    throw error;
  }
}

async function deleteReview(review_id) {
  try {
    const sql = `DELETE FROM reviews WHERE review_id = $1 RETURNING *;`;
    const result = await pool.query(sql, [review_id]);
    return result.rows[0];
  } catch (error) {
    console.error('deleteReview Error:', error);
    throw error;
  }
}

module.exports = {
  addReview,
  getReviewsByInventory,
  updateReview,
  deleteReview,
};
