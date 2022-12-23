const Campground = require("../model/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
        req.flash('error','Cannot find the campground');
        return res.redirect('/campgrounds')
    }else{
        res.render("campgrounds/index", {campgrounds})   
    } 
};

module.exports.renderNewForm = async (req, res) => {
    res.render("campgrounds/new")
};

module.exports.createCampground = async(req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid campground", 400);
     const campground = new Campground(req.body.campground);
     campground.author = req.user._id;
     await campground.save();
     req.flash("success", "Succesfully made a new campground");
     res.redirect(`campgrounds/${campground._id}`)
 };

 module.exports.updateCampground = async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    if (!campground) {
        req.flash('error','Cannot find the campground');
        return res.redirect('/campgrounds');
    }else{
        req.flash('success', 'Succesfully updated campground');
        res.redirect(`/campgrounds/${campground._id}`)      
    } 
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
        path: "author"
        }
    }).populate('author');
    res.render("campgrounds/show", {campground});  
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {campground})
};

module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "succesfully deleted campground");
    res.redirect("/campgrounds")
};