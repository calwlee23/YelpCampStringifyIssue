if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();     //require the dotenv module and call the config function
}

// console.log(process.env.SECRET)
// console.log(process.env.API_KEY)

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const Campground = require('./models/campground');
const Review = require('./models/review')
const methodOverride = require('method-override');
const wrapAsync = require('./utilities/wrapAsync');
const AppError = require('./utilities/AppError');
// const Joi = require('joi');                  // do this in joiSchemas.js
const { campgroundSchema, reviewSchema } = require('./joiSchemas');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp-v5', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));    // To ensure you can run this file from anywhere
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));      // Serve the public directory (Serve the static asset) 
// also ensure you can locate this directory from anywhere

const sessionConfig = {                     // Configuration object 
    secret: 'thisshouldbeabettersecret',    // must be an actual secret in production
    resave: false,                          // to ensure theres no deprecation warning
    saveUnitialized: true,                  // to ensure theres no deprecation warning
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  // to make the cookie expires in 7 days (in milliseconds)
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true                      // for added security, never reveal the cookie to a third party
    }
}

app.use(session(sessionConfig));    // Make sure session() is used before passport.session()
app.use(flash());

app.use(passport.initialize()); // to initialize Passport
app.use(passport.session());    // for the app to have persistent login session
passport.use(new localStrategy(User.authenticate()));    // authenticalte() is a static method in User model

passport.serializeUser(User.serializeUser()); // How to store user in a session
passport.deserializeUser(User.deserializeUser());  // How to un-store user in a session

app.use((req, res, next) => {               // Middleware for flash on every single request
    res.locals.info = req.flash('success');
    // You will have access to 'success' flash message under local key 'info' in the ejs template without having to pass it through
    res.locals.err = req.flash('error');
    // You will have access to 'error' flash message under local key 'err' in the ejs template without having to pass it through
    res.locals.currentUser = req.user;
    // You will have access to req.user under local key 'currentUser' in the ejs template without having to pass it through
    // console.log(req.session)    // to check the session
    next();
})

const campgroundsRoutes = require('./routes/campgrounds');
app.use('/campgrounds', campgroundsRoutes);  // 1st: path you want to prefix with, 2nd: the campgrounds router
const reviewsRoutes = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviewsRoutes);  // 1st: path you want to prefix with, 2nd: the reviews router
const usersRoute = require('./routes/users');
app.use('/', usersRoute);

app.get('/', (req, res) => {    // When you go to localhost:3000 only
    res.render('home')
})
// app.get('/newcampground', async (req, res) => {
//     const camp = new Campground({ title: 'My Garden', description: 'cheap camping' })
//     await camp.save();
//     res.send(camp);
// })


app.all('*', (req, res, next) => {      // For all types of request to any path
    next(new AppError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err })
    // res.status(statusCode).send(message);
    // res.send('Whoops, something went wrong!')
})

app.listen(3000, () => {
    console.log('Listening/Serving on Port 3000')
})

