var mongoose=require('mongoose');
var Campground=require('./models/campground');
var Comment=require('./models/comment');

data=[
    {   name:"Wisconsin",
        image:"https://www.gannett-cdn.com/-mm-/615eb9b3dda3f2daf3ceb045278d833fb7918d51/c=0-286-5616-3459/local/-/media/2017/07/18/WIGroup/Milwaukee/636359756074681331-IMG-1848.jpg?width=660&height=373&fit=crop&format=pjpg&auto=webp",
        description:"Campground 1"
    },
    {
        name:"Poconos",
        image:"https://res.cloudinary.com/simpleview/image/upload/v1584361003/clients/poconos/Campgrounds_Exterior_Keen_Lake_1_PoconoMtns_d606c492-eb33-450d-a725-e173b70c6cb8.jpg",
        description:"Campground 2"
    },
    {
        name:"Mount Rainer",
        image:"https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
        description: "Campground 3"
    }
];
function seedDb() {
    Campground.remove({},function(e,r){
        if(e)
        {
            console.log(e);
        }else{
            console.log("campgrounds removed");
            data.forEach(function(seed){
                Campground.create(seed,function(err,data){
                    if(err){console.log(err)}
                    else{
                        console.log("Campground added");
                        Comment.create(
                            {
                                text:"This is a great campground for camping",
                                author:"Mr.x"
                            },function(error,com){
                                if(error){console.log(error)}
                                else{
                                    data.comments.push(com);
                                    data.save();
                                    console.log("comment added")
                                }
                            }
                        )
                    }
                })
            })
        }
    })
    
}
module.exports=seedDb;