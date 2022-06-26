const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/4273542/reviews
// GET /tour/4273542/reviews
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );
// router
//   .route('/:id')
//   .get(reviewController.getReview)
//   .patch(reviewController.updateReview)
//   .delete(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     reviewController.deleteReview
//   );
module.exports = router;
