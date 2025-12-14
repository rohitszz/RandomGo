
const cloudinary = require('cloudinary').v2;
const multiavatar = require("@multiavatar/multiavatar");

exports.uploadImageToCloudinary  = async () => {
    try{
    const randomSeed = Math.random().toString(36).substring(2, 15);

    const svgCode = multiavatar(randomSeed);
    
    const img = `data:image/svg+xml;base64,${Buffer.from(svgCode).toString('base64')}`;

    const uploadedImage = await cloudinary.uploader.upload(img, {
        folder: 'avatars',
        resource_type: "image",
        format: "png",
    });
    
    return uploadedImage.secure_url;

    }
    catch(error){
     console.error("Cloudinary Upload Failed:", error);
    return null;
    }
  
}


