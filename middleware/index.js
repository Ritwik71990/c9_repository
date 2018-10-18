var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
var Review = require("../models/review");
// All the middleware goes here
var middlewareObj ={};

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        next();
    }
    else{
        req.flash("error", "Oops !! You need to Login First !")
        res.redirect("/login");
    }
}

function checkCommentOwnership(req, res, next){
    if(!req.isAuthenticated()){
        req.flash("error", "Oops !! You need to be Logged in to do that !")
        res.redirect("/login")
    }
    else{
        // Find the Comment
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                req.flash("error", "Sorry ! You don't have premission to do that")
                res.redirect("back")
            }
            else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next()
                }
                else{
                    req.flash("error", "Sorry ! You don't have premission to do that")
                    res.redirect("back")
                }
            }
        })
    }
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        // does the user own the campground
        // Find the campground 
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                req.flash("error", "Oops !! Campground not found")
                res.redirect("back");
            }
            else{
                // Does the user own the campground
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next()
                }else{
                    req.flash("error", "Sorry ! You don't have permission to do that !")
                    res.redirect("back");
                }
            }
        })
    }
    else{
        req.flash("error", "Oops !! You need to logged in to do that !")
        res.redirect("back");
    }
    
}

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("back");
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = isLoggedIn;
middlewareObj.checkCommentOwnership = checkCommentOwnership;
middlewareObj.checkCampgroundOwnership = checkCampgroundOwnership

module.exports = middlewareObj;