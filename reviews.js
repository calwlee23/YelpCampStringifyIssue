const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;       //set the author of review the same as the logged-in user who posted the review
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review.');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; // Destructure
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // delete reviewId (ObjectId) from the reviews array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review.');
    res.redirect(`/campgrounds/${id}`)
};