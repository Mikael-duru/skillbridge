const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
	const { fullName, email, password, role } = req.body;

	// Check for existing user by username and email
	const existingUser = await User.findOne({ email });

	if (existingUser) {
		return res.status(400).json({
			success: false,
			message: "Email already exists.",
		});
	}

	const hashPassword = await bcrypt.hash(password, 10);

	// Create the new user
	const newUser = new User({
		fullName,
		email,
		role,
		password: hashPassword,
	});

	await newUser.save();

	return res.status(201).json({
		success: true,
		message: "User registered successfully!",
	});
};

const loginUser = async (req, res) => {
	const { userEmail, userPassword } = req.body;

	const checkUser = await User.findOne({ email: userEmail });

	if (!checkUser || !(await bcrypt.compare(userPassword, checkUser.password))) {
		return res.status(401).json({
			success: false,
			message:
				"Invalid credentials. \n Please check your email and/or password.",
		});
	}

	const accessToken = jwt.sign(
		{
			_id: checkUser._id,
			fullName: checkUser.fullName,
			email: checkUser.email || userEmail,
			role: checkUser.role,
		},
		"JWT_SECRET",
		{ expiresIn: "120m" }
	);

	return res.status(200).json({
		success: true,
		message: "Logged in successfully!",
		data: {
			accessToken,
			user: {
				_id: checkUser._id,
				fullName: checkUser.fullName,
				email: checkUser.email || userEmail,
				role: checkUser.role,
			},
		},
	});
};

const resetPassword = async (req, res) => {
	const { userEmail, newPassword, confirmPassword } = req.body;

	const checkUser = await User.findOne({ email: userEmail });
	if (!checkUser) {
		return res.status(404).json({
			success: false,
			message: "User not found.",
		});
	}

	if (newPassword !== confirmPassword) {
		return res.status(400).json({
			success: false,
			message: "Passwords do not match.",
		});
	}

	const hashPassword = await bcrypt.hash(newPassword, 10);

	checkUser.password = hashPassword;
	await checkUser.save();

	return res.status(200).json({
		success: true,
		message: "Password changed successfully!",
	});
};

module.exports = { registerUser, loginUser, resetPassword };
