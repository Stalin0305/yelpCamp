var express= require("express");
var app=express();
var bodyparser= require("body-parser");
var jsonParser = bodyparser.json();
var deepPopulate=require('mongoose-deep-populate');
var mongoose = require("mongoose");
var campground=require('./models/campground');
var ObjectId=require('mongo')
var seedDb=require('./seed');
const comment = require("./models/comment");

seedDb();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));


app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", { campground: allCampgrounds });
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
    res.render("campgrounds/new");
    // res.render("show");
});

app.get("/campgrounds/:id",function(req,res){
    console.log(req.params.id);
    campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            console.log(foundCamp);
            res.render("campgrounds/show", { campg:foundCamp });
        }
    });
  
});

app.get('/campgrounds/:id/comments/new',function(req,res){
    var obj;
    campground.findById(req.params.id,function(e,r){
        if(e) {console.log(e);}
        else{
            res.render('comments/new',{campground:r});        
        }
    })
    
})

app.post('/campgrounds/:id/comments',function(req,res){
    console.log(req.body.comment);
    campground.findById(req.params.id,function(e,campground){
        if(e){
            console.log(e);
            res.redirect('/campgrounds');
        }
        else{
            comment.create(req.body.comment,function(err,comment){
                if(err){ console.log(err);}
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                }
            })
        }
    })
})
app.listen(3000,function(){
    console.log("You have connected to yelp ");
});