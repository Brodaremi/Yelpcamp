const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reviews = require("./review")

const campgroundSchema = new Schema ({
    title: String,
    image: String,
    price: Number,
    location: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

campgroundSchema.post("findOneAndDelete", async function(doc){
    if(doc){
        await Reviews.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
});

module.exports = mongoose.model("campground", campgroundSchema)