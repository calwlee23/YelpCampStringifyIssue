const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})  //setting the configuration on Cloudinary (associating our account to this Cloudinary instance)

const storage = new CloudinaryStorage({         //setting up an instance of Cloudinary storage
    cloudinary,
    params: {
        folder: 'YelpCamp',     // The folder in Cloudinary that we store stuffs in.
        allowedFormats: ['jpeg', 'jpg', 'png', 'avif']      //avif is a new format introduced around 2020
    }
})

module.exports = {
    cloudinary,
    storage
}