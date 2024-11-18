const mongoose = require("mongoose");
const Review = require("./review.js");


const listingSchema = new mongoose.Schema({
    title:{
     type:String,
     required: true,
    },
    description:String,
    image:{
      url:String,
      filename: String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:String,
    country:String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
    },
    // / storing cordinates
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required: true
        }
    },
    category:{
        type:String,
        enum:['Cabin','Adventure','Countryside','Trending','Ski','Nature','Luxury',,'Mountain','Urban', 'Rooms', 'Iconic_Cities', 'Mountains', 'Castles', 'Amazing_Pool', 'Camping', 'Farms', 'Arctic', 'Domes', 'House_Boats']
    }


});
listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
     await Review.deleteMany({ _id: {$in: listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

