var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
var data = [
    {
        name :"Cloud's Rest", 
        image: "https://www.backpacker.com/.image/t_share/MTQ0OTE0MjA0MTk5MTY3NTUz/half-dome-and-the-valley.jpg",
        description : 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. '
    },
    {
        name :"Manali", 
        image: "https://images.thrillophilia.com/image/upload/s--HhJ_YxCr--/c_fill,f_auto,fl_strip_profile,h_600,q_auto,w_975/v1/images/photos/000/090/525/original/1466512867_f_5.png.jpg?1466512867",
        description : 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. '
    },
    {
        name :"Ooty", 
        image: "https://www.hlimg.com/images/places2see/738X538/13_1490272276p.jpg",
        description : 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. '
    },
]

function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        }
        else{
            console.log("Removed All Campgrounds")
            
            // Add in a few Campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err,campground){
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("Added a new Campground");
                        
                        // Create a Comment on each Campground
                        Comment.create(
                            {
                                text : "This place is great, but i wish there was Internet here",
                                author: "Homer"
                            }, function(err,comment){
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    campground.comments.push(comment._id);
                                    campground.save();
                                    console.log("Created a Comment")
                                }
                            }
                        )
                    }
                })
            })
            
        }
    })
} 

module.exports = seedDB;
