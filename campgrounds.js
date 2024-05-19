const campground = require('../models/campground');
const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;// to grab your mapbox token from the .env file and save it as a variable
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // pass in that token when you instantiate a new Mapbox Geocoding instance
// This geocoder client will contain two methods which are forward and reverse geocoding

module.exports.showIndex = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // res.send(geoData.body.features[0].geometry.coordinates);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry; //add on geometry to the campground
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })) //map() calls the function on each element 'f' in the array
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);                                        // to check images are updated in camgpround modelinstance
    req.flash('success', 'Successfully made a new campground.');    // flash a message when creating new campground
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',            // populate all the reviews of the campground
        populate:
            { path: 'author' }      // populate author for each of the reviews
    }).populate('author');          // populate the author of the campground
    // console.log(campground);    //to check the campground info on the terminal
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
    console.log(campground);
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });     // spread the key-values under campground
    const imgsArray = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgsArray);                                           // spread the objects under imgsArray
    await campground.save();
    if (req.body.deleteImages) {      // Only if there is image(s) to delete
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })   //pull from the images array all images where their filenames are in the deleteImages array
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    };
    req.flash('success', 'Successfully updated campground.');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds')
}


























