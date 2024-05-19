const { campgroundSchema, reviewSchema } = require('./joiSchemas');
const AppError = require('./utilities/AppError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER...', req.user);
    if (!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl); //print out the router path and url path that user wanted to go to
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    // if (!req.body.campground) throw new AppError('Invalid/Incomplete Data', 400);
    const { error } = campgroundSchema.validate(req.body);
    // console.log(result);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(',') //join with comma if there is more than one message
        throw new AppError(msg, 400)
    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(',') //join with comma if there is more than one message
        throw new AppError(msg, 400)
    } else {
        next();
    }
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}







// module.exports.testReqUser = (req, res, next) => {
//     console.log('userDetails', req.user.username);
//     next();
// }