const jwt = require("jsonwebtoken");

const verifyToken = (token, jwtSecret) => {
	return jwt.verify(token, jwtSecret);
};

const auth = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({
			success: false,
			message: "User is not authenticated",
		});
	}

	const token = authHeader.split(" ")[1];

	// Get user info from accessToken payload
	const payload = verifyToken(token, "JWT_SECRET");

	// Create the user, which will be used in the callback
	req.user = payload;

	next();
};

module.exports = auth;
