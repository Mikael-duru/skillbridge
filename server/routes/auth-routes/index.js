const express = require("express");
const {
	registerUser,
	loginUser,
} = require("../../controllers/auth-controller/index");
const authMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

// Create api endpoints (path: '/register', it calls the method registerUser)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authMiddleware, (req, res) => {
	const user = req.user;

	res.status(200).json({
		success: true,
		message: "User is authenticated",
		data: {
			user,
		},
	});
});

module.exports = router;
