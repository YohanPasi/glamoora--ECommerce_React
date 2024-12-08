const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Await } = require('react-router-dom');


cloudinary.config({
    cloud_name: 'dyxpeyv1n',
    api_key: '237547874535689',
    api_secret: 'fFaL5AFmWvaOF4PW2gfFIRLy1Ag',
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    })
    return result;
}

const upload = multer({storage});
module.exports = {upload, imageUploadUtil}