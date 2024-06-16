const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb+srv://akv:akv1@cluster0.vz5vwaq.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10  ;
    const camp = new Campground({
      author: "643240011dfc583985ae0fa1",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: { type: "Point", coordinates: [
        cities[random1000].longitude,
        cities[random1000].latitude,
      ] },
      images: [  
        { 
          url:
            "https://res.cloudinary.com/dt0rxowoi/image/upload/v1681143779/YelpCamp/upmnd9qbm4r0v2qimhlc.jpg",
          filename: "YelpCamp/upmnd9qbm4r0v2qimhlc"
        },      
        {
          url:
            "https://res.cloudinary.com/dt0rxowoi/image/upload/v1681143779/YelpCamp/wj31unnks2rzk3hycubi.jpg",
          filename: "YelpCamp/wj31unnks2rzk3hycubi"
        }
      ],
      description:
        "lorem ipsum dolor sit amet, consectetur lorem ipsum dolor lorem ipsum dolor sit amet, consectetur lorem ipsum dolor lorem ipsum dolor sit amet, consectetur lorem ipsum dolor lorem ipsum dolor sit amet, consectetur lorem ipsum dolor",
      price
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
