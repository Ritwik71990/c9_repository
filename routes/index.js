var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comment.js");
var User        = require("../models/user");
var Notification= require("../models/notification")
var passport    = require("passport");
var middleware  = require("../middleware/index");

// Root Route
router.get("/", function(req,res){
    res.render("landing");
});

//===================================
// AUTH routes
//===================================


// Sign Up Form
router.get("/register", function(req, res) {
    res.render("register")
})

// Sign Up Logic 

router.post("/register",function(req, res) {
    if (req.body.adminCode == "Justbring@it1"){
        var isAdmin = true;
    }
    else{
        var isAdmin = false
    }
    var username = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var avatar = req.body.avatar;
    
    var newUser = new User({
        username : username,
        isAdmin : isAdmin,
        firstName:firstName,
        lastName : lastName,
        email : email,
        avatar : avatar,
    })
    User.register(newUser,req.body.password,function(err, user){
        if (err){
            console.log(err)
            req.flash("error",err.message);
            res.redirect("/register")
        }
        else{
            // User is signed in, so start the session
            passport.authenticate("local")(req,res, function(){
                req.flash("success","Hey "+String(user.username) +"!! Welcome to YelpCamp !!")
                res.redirect("/campgrounds")
            })
        }
    })
})

// Login Form 
router.get("/login", function(req, res) {
    res.render("login");
})

// Login Logic (using middleware)
// app.post("path", middleware, callback) 
router.post("/login",passport.authenticate("local",{
    successRedirect :"/campgrounds",
    failureRedirect :"/login"
}),function(req, res) {
    
})

// Logout Logic 
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Logged you out")
    res.redirect("/campgrounds")
})

// User Profile routes
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id).populate("followers").exec(function(err, foundUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("back")
        }
        else{
            Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back")
                }
                else{
                    res.render("users/show",{user:foundUser,campgrounds:campgrounds});
                }
            })
            
        }
    })
});


module.exports = router;