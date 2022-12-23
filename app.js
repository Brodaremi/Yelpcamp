const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require("mongoose");
const ExpressError = require("./utilis/ExpressError");
const app = express();
const path = require("path");
const Campground = require("./model/campground");
const Review = require("./model/review");
const catchAsync = require("./utilis/catchASync");
const Joi = require("joi");
const {campgroundSchema, reviewSchema} = require("./schemas.js")
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const User = require('./model/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const { deserialize } = require("v8");
const { deserializeUser } = require("passport");
const userRoutes = require('./routes/user');



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
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());


const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get("/", (req, res) => {
    res.render("home")
});

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