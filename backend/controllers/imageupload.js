const cloudinary = require('cloudinary').v2;
const streamifier = require("streamifier");

exports.imageUpload = async (req, res) => {
  try {
    if (!req.file) { 
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "chat_images" },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }

        return res.status(200).json({
          success: true,
          imageUrl: result.secure_url,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
