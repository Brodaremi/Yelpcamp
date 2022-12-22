const express = require('express');
const router = express.Router();
const Campground = require("../model/campground");
const catchAsync = require("../utilis/catchASync");
const ExpressError = require("../utilis/ExpressError");
const {campgroundSchema} = require("../schemas.js");
const {isLoggedIn} = require('../middleware');



const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
     const msg = error.details.map(el => el.message).join(",")
     throw new ExpressError(msg, 400)
    } else {
     next()
    }
};

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
        req.flash('error','Cannot find the campground');
       return res.redirect('/campgrounds')
    }else{
        res.render("campgrounds/index", {campgrounds})   
    } 
}))

router.get("/new",isLoggedIn, catchAsync(async (req, res) => {
    res.render("campgrounds/new")
}))

router.post("/",isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid campground", 400);
     const campground = new Campground(req.body.campground);
     await campground.save();
     req.flash("success", "Succesfully made a new campground");
     res.redirect(`campgrounds/${campground._id}`)
 }))

router.put("/:id",isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    if (!campground) {
        req.flash('error','Cannot find the campground');
        return res.redirect('/campgrounds');
    }else{
        req.flash('success', 'Succesfully updated campground');
        res.redirect(`/campgrounds/${campground._id}`)      
    } 
}))

router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", {campground});  
}))

router.get("/:id/edit",isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {campground})
}))

router.delete("/:id",isLoggedIn, catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "succesfully deleted campground");
    res.redirect("/campgrounds")
}));


module.exports = router;