var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment.js");
var User        = require("../models/user");
var passport    = require("passport");
var middleware  = require("../middleware/index");
var Review = require("../models/review");


////////////////////////////////////////////////////
// Campground Routes
////////////////////////////////////////////////////

// INDEX Route - Show all Campgrounds
router.get("/", function(req,res){
    // This page will contain all the campgrounds
    // Get all campgrounds from db
    if(req.query.search){
        const regex =new RegExp(escapeRegex(req.query.search),"gi");
        Campground.find({name : regex}, function(err, allCampgrounds){
            if(err){
                console.log(err)
                req.flash("error","Oops !! Something went wrong !!")
            } else{
                // if logged in, currentUser contains username and _id, else it is undefined
                var currentUser = req.user;
                res.render("campgrounds/index",{campgrounds : allCampgrounds ,currentUser : currentUser})
            }
            
        })    
    }
    else{
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err)
                req.flash("error","Oops !! Something went wrong !!")
            } else{
                // if logged in, currentUser contains username and _id, else it is undefined
                var currentUser = req.user;
                res.render("campgrounds/index",{campgrounds : allCampgrounds ,currentUser : currentUser})
            }
            
        })
    }
})

// CREATE route : Add new Campground
router.post("/",middleware.isLoggedIn,function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description
    var price = req.body.price;
    // Add the campground author here too
    var author = {
        username : req.user.username,
        id : req.user._id
    };
    
    // Push this campground into the Database
    var newCampground = {name : name, image :image, description:description,price:price, author:author}
    
    Campground.create(newCampground, function(err, campground){
        if (err){
            console.log(err)
        }
        else{
            console.log("Newly Created Campground : ",campground);
            req.flash("success","Great !! New Campground Created !")
            // redirect back to the /campgrounds page
            res.redirect("/campgrounds");
        }
    });

    
    
})

// NEW Route : Show the form to create a new Campground
// This route shows the user the form which he/she needs to fill to add a new campground.
router.get("/new",middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
})

// SHOW route

router.get("/:id", function(req, res) {
    // Find the Campground with the provided id
   //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

// EDIT Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        // Not handling error as it is already handled in the middleware
        res.render("campgrounds/edit",{campground:foundCampground} );
        
    });
    
});

// UPDATE Campground Route
router.put("/:id",middleware.checkCampgroundOwnership ,function(req, res){
    delete req.body.campground.rating;
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground , function(err, updatedCampground){
        // redirect back to the show page
        req.flash("success","Great !! Campground Updated !!")
        res.redirect("/campgrounds/"+String(req.params.id))
        
    })
   
})

// DESTROY Campground Route
// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}


module.exports = router;