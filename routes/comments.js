var express     = require("express");
var router      = express.Router({mergeParams:true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment.js")
var middleware  = require("../middleware/index");


///////////////////////////////////////////////////////
// Comments Routes
///////////////////////////////////////////////////////

// NEW Route
router.get("/new",middleware.isLoggedIn ,function(req, res) {
    // Find the Campground by Id
    Campground.findById(req.params.id, function(err, found_campground){
        if(err){
            console.log(err)
        }
        else{
            res.render("comments/new",{campground:found_campground})
        }
    })
    
})

// CREATE Route
router.post("/",middleware.isLoggedIn, function(req, res){
    // Lookup Campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            res.flash("error", err.message);
            res.redirect("/campgrounds")
        }
        else{
            // Create a new Comment
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                    console.log(err)
                    res.flash("error", err.message)
                }
                else{
                    // Add username and id to the comment and save the comment
                    comment.author.username = req.user.username
                    comment.author.id = req.user._id
                    comment.save()
                    
                    // Connect new comment to campground
                    campground.comments.push(comment)
                    campground.save();
                    // Redirect to Campground Show Page
                    req.flash("success", "Great ! Comment successfully added !")
                    res.redirect("/campgrounds/"+String(campground._id));
                }
            })
        }
    })
})

// EDIT Show Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    var campgroundId = req.params.id;
    // Find the comment
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            req.flash("error", err.message)
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{campgroundId:campgroundId,comment:foundComment});
        }
    })
})

// EDIT Update Route
router.put("/:comment_id",middleware.checkCommentOwnership ,function(req,res){
    // Find the Comment and update it
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back")
        }
        else{
            console.log(updatedComment)
            req.flash("success", "Great !! Comment Updated !")
            res.redirect("/campgrounds/"+String(req.params.id));
        }
    })
})

// DELETE Comment Route 

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Sorry !! You are not allowed to delete this comment !")
            res.redirect("back");
        }
        else{
            req.flash("success", "Great ! Comment deleted")
            res.redirect("/campgrounds/"+String(req.params.id))
        }
    })
})



module.exports = router;