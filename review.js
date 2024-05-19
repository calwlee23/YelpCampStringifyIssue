const mongoose = require('mongoose');
const Schema = mongoose.Schema;         // Just to create a variable because we will be using mongoose.Schema often

const reviewSchema = new Schema({
    reviewBody: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'                 // this author will be a reference to the User model instance
    }
})

module.exports = mongoose.model('Review', reviewSchema);
