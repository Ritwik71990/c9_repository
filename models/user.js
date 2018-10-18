var mongoose                 = require("mongoose"),
    passportLocalMongoose    = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username : String,
    password : String,
    avatar : String,
    firstName : String,
    lastName : String,
    email : String,
    notifications : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Notification',
            default : [],
        }
        ],
    followers: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
        ],
    isAdmin : {type : Boolean, default : false},
});
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;