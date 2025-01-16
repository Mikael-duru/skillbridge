const express = require("express");
const multer = require("multer");
const {
	uploadMediaToCloudinary,
	deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

// Create the router
const router = express.Router();

// Store uploaded files in the the uploads folder in the server.
const upload = multer({ dest: "uploads/" });

// Methods

// Upload a single file
router.post("/upload", upload.single("file"), async (req, res) => {
	try {
		const result = await uploadMediaToCloudinary(req.file.path);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: "Error uploading file",
		});
	}
});

// Upload bulk file
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
	try {
		const uploadPromises = req.files.map((fileItem) =>
			uploadMediaToCloudinary(fileItem.path)
		);

		const result = await Promise.all(uploadPromises);

		res.status(200).json({
			success: true,
			data: result,
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
