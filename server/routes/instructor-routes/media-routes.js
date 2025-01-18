const express = require("express");
const multer = require("multer");
const {
	uploadMediaToCloudinary,
	deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

// Create the router
const router = express.Router();

// multerConfig.js - Store uploaded files in multer memory storage.
const storage = multer.memoryStorage();
const uploads = multer({ storage });
module.exports = uploads;

// Methods

// Upload a single file
router.post("/upload", uploads.single("file"), async (req, res) => {
	try {
		const file = req.file;

		if (!file) {
			return res.status(400).send("No file uploaded.");
		}

		const uploadResult = await uploadMediaToCloudinary(file);

		res.status(200).json({
			success: true,
			data: uploadResult,
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: "Error uploading file",
		});
	}
});

// Upload bulk file
router.post("/bulk-upload", uploads.array("files", 15), async (req, res) => {
	try {
		const files = req.files;

		if (!files) {
			return res.status(400).send("No files uploaded.");
		}

		const uploadPromises = files.map((fileItem) =>
			uploadMediaToCloudinary(fileItem)
		);

		const uploadResult = await Promise.all(uploadPromises);

		res.status(200).json({
			success: true,
			data: uploadResult,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Error uploading bulk file",
		});
	}
});

router.delete("/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;

		console.log("[MEDIA_DELETE_PARAMS_ID]:", id);

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "Asset Id is required",
			});
		}

		await deleteMediaFromCloudinary(id);

		res.status(200).json({
			success: true,
			data: "Asset deleted successFully from cloudinary",
		});
	} catch (e) {
		console.log("[delete_Media]:", e);
		res.status(500).json({
			success: false,
			message: "Error deleting file",
		});
	}
});

module.exports = router;
