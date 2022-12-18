const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    body: String,
    rating: String,
});

module.exports = mongoose.model("Review", reviewSchema)