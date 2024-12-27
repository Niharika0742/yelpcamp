const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Save the original URL for redirect after login
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

// Validation middleware for Campground
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body); // Validate using Joi schema
    if (error) {
        const msg = error.details.map(el => el.message).join(','); // Format error messages
        throw new ExpressError(msg, 400); // Throw custom error
    } else {
        next();
    }
};

// Check if the current user is the author of the campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Find the campground by ID
    
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }

    // Check if the logged-in user is the same as the campground's author
    if (!campground.author.equals(req.user._id)) { // Using .equals() to compare ObjectId
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

// Check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId); // Find the review by ID

    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/campgrounds/${id}`);
    }

    // Check if the logged-in user is the same as the review's author
    if (!review.author.equals(req.user._id)) { // Using .equals() to compare ObjectId
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

// Validation middleware for Review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate review data
    if (error) {
        const msg = error.details.map(el => el.message).join(','); // Format error messages
        throw new ExpressError(msg, 400); // Throw custom error
    } else {
        next();
    }
};
