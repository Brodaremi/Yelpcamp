const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Campground = require("./model/campground");
const Review = require("./model/review");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilis/catchASync");
const ExpressError = require("./utilis/ExpressError");
const Joi = require("joi");
const {campgroundSchema, reviewSchema} = require("./schemas.js")


mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp', {useNewUrlParser: true,  useUnifiedTopology: true})
const db = mongoose.connection;
db.on("err", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})


app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));


const validateCampground = (req, res, next) => {
       const {error} = campgroundSchema.validate(req.body);
       if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
       } else {
        next()
       }
};

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
       } else {
        next()
       }
}


app.post("/campgrounds", validateCampground, catchAsync(async(req, res) => {
   // if (!req.body.campground) throw new ExpressError("Invalid campground", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`)
}))
app.put("/campgrounds/:id", validateCampground, catchAsync(async(req, res) => {
        const {id} = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
        res.redirect(`/campgrounds/${campground._id}`)
}))
app.delete("/campgrounds/:id", catchAsync(async(req, res) => {
        const {id} = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds")
}))

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review (req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get("/", (req, res) => {
    res.render("home")
})
app.get("/campgrounds", catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", {campgrounds})    
}))
app.get("/campgrounds/new", catchAsync(async (req, res) => {
    res.render("campgrounds/new")
}))
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate('reviews');
        res.render("campgrounds/show", {campground});  
}))
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", {campground})
}))
app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async(req, res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))

app.all("*", (req, res, next) => {
    next (new ExpressError ("Page Not found", 404));
    res.send("404 ERROR")
})
app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message)err.message = "something went wrong";
    res.status(statusCode).render("error", {err});
})


app.listen(3000, () => {
    console.log("App is listening on port 3000!");
});