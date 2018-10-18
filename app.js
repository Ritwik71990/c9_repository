// Initialisation

var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    seedDB              = require("./seeds"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    User                = require("./models/user"),
    expressSession      = require("express-session"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash"),
    moment              = require("moment");
    

// Route Files 

var commentRoutes    = require("./routes/comments"),
    reviewRoutes     = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/yelp_camp_v9",{ useNewUrlParser: true });
app.use(methodOverride("_method"));
app.use(flash());
// Seed New Data
// seedDB();

// Passport Configuration
app.use(expressSession({
    secret : "This is YelpCamp",
    resave : false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass the loged in user to every template 
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.moment = moment;
    
    // Access Flash globally middleware
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Start the server

app.listen(process.env.PORT , process.env.IP, function(){
    console.log("The YelpCamp Server Has Started Successfully !!");
})


