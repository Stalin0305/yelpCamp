var express= require("express");
var app=express();
var bodyparser= require("body-parser");
var jsonParser = bodyparser.json()
var mongoose = require("mongoose");
var campground=require('./models/campground');
var ObjectId=require('mongo')
var seedDb=require('./seed');

seedDb();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));


// var campgroundSchema=new mongoose.Schema(
//     { name: String,
//       image: String,
//       description: String
//     }
// );

// var campground=mongoose.model("campground",campgroundSchema);

// campground.create(
//     {
//         name: "Gareth hill", image: "https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
//     },function(err,campground){
//         if(err){
//             console.log("There is a error ");
//         } else {
//             console.log("New campground : "+campground);
//         }
//     }
// );
// campground.remove({name: "Gareth hill"},function(err,camp){
//     if(err){
//         console.log("Error");
//     }
//     else{
//         console.log("deleted");
//     }
// });
app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", { campground: allCampgrounds });
        }
    })
    
});
// var campgrounds = [
//     { name: "Gareth hill", image: "https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
//     { name: "Mountain creek", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
//     { name: "Sleezy site", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
//     { name: "Sleezy site", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
//     { name: "Sleezy site", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
//     { name: "Sleezy site", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
// ]
app.post("/campgrounds",jsonParser,function(req,res){
    // res.send("This is a post request");
    var name=req.body.name;
    console.log(name);
    var image= req.body.image;
    var desc=req.body.description;
    var newCampground={name: name, image: image,description:desc};
    console.log(newCampground);
    campground.create(newCampground,function(err,newCamp){
        if(err){
            console.log(err);
        }else{
            console.log("New campground added\n"+newCamp);
        }
    })
    // campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
});

app.get("/campgrounds/:id",function(req,res){
    // console.log(req.params.id);
    campground.find({_id:req.params.id}).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            console.log(foundCamp);
            res.render('show',{camp:foundCamp});
        }
    });
  
});
app.listen(3000,function(){
    console.log("You have connected to yelp ");
});