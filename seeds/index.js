const { random } = require("lodash");
const mongoose = require("mongoose");
const Campground = require("../model/campground");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");

mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on("err", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

 const seedDB = async () => {


    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground ({
            author: "63a08516e7a5f3fb8b259e0a",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt illum iusto sequi commodi alias odio expedita pariatur ea nostrum voluptas reiciendis vel, tempore ipsam ipsum praesentium, quidem fugiat eius? Repellat Esse amet sit tenetur repellat quo. Quibusdam magni autem beatae, adipisci, soluta nesciunt quod saepe aperiam provident assumenda nobis debitis porro voluptatum possimus dolorum asperiores quasi, natus perspiciatis itaque ipsa Architecto magnam in autem dolorum beatae. Ad corrupti omnis in, labore sequi aperiam iusto assumenda repudiandae, doloremque, atque ex quaerat? Tempore explicabo incidunt obcaecati eum laboriosam aspernatur est mollitia natus."
        });
        await camp.save();   
    }
 }
 seedDB().then(() => {
mongoose.connection.close();
 });