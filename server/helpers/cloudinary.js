const cloudinary = require("cloudinary").v2;

// Configure with env data
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to cloudinary
const uploadMediaToCloudinary = async (file) => {
	try {
		const uploadResult = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					resource_type: "auto",
				},
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				}
			);

			// Write the buffer to the stream
			uploadStream.end(file.buffer);
		});

		return uploadResult;
	} catch (error) {
		console.log(error);
		throw new Error("Error uploading to cloudinary");
	}
};

// Delete media from cloudinary
const deleteMediaFromCloudinary = async (publicId) => {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.log(error);
		throw new Error("failed to delete asset from cloudinary");
	}
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
