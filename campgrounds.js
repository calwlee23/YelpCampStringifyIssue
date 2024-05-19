const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');    // dotdot to go back one level to look for utilities folder
// const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');

//const upload = multer({ dest: 'upload/' });     // storing the user-uploaded files locally in a folder called 'upload'
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(campgrounds.showIndex))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground));
//change single to array for uploading multiple files, but also change the form to accept multiple files
//the argument inside single() or array() is the name attribute in the <input> in the form. 
// console.log(req.body, req.files);       //if single, req.file; if array, req.files

// router.get('/', wrapAsync(campgrounds.showIndex));
// router.post('/', isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);  //this need to be placed before the route for /:id

router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

// router.get('/:id', wrapAsync(campgrounds.showCampground));
// router.put('/:id', isLoggedIn, validateCampground, isAuthor, wrapAsync(campgrounds.updateCampground));
// router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;
















