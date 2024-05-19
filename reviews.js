const express = require('express');
const router = express.Router({ mergeParams: true });   // mergeParams to ensure :id from app.js merge properly and works here.
const wrapAsync = require('../utilities/wrapAsync');    // dotdot to go back one level to look for utilities folder
const AppError = require('../utilities/AppError');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;