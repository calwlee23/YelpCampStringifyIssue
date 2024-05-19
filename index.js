const mongoose = require('mongoose');
const Campground = require('../models/campground');     // .. to go back up one level 
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp-v5', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const randomElement = array => array[Math.floor(Math.random() * array.length)];

const seed = async () => {               // Create a function called seed
    await Campground.deleteMany({});    // Delete everything present in the database
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 10;
        const camp = new Campground({
            author: '6640d7cf0da463316098888b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${randomElement(descriptors)} ${randomElement(places)}`,
            // image: 'https://source.unsplash.com/collection/4977823/700x400',
            images: [
                {
                    url: 'https://res.cloudinary.com/calwlee23/image/upload/v1663179254/YelpCamp/mro42el2t7ewizsmolha.jpg',
                    filename: 'YelpCamp/mro42el2t7ewizsmolha'
                },
                {
                    url: 'https://res.cloudinary.com/calwlee23/image/upload/v1663179254/YelpCamp/xr7iicuonzx06kkwq40f.jpg',
                    filename: 'YelpCamp/xr7iicuonzx06kkwq40f'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor culpa quidem dolorum amet molestiae asperiores totam velit possimus quae perspiciatis eum quibusdam rerum dolore facere harum corrupti, minus quos.',
            price,   // shorthand for price: price
            geometry: {
                type: 'Point',
                coordinates: [7.4256, 43.740445]
            }
        })
        await camp.save();
    }
}

seed().then(() => {
    db.close();
})