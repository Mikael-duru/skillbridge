const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
	const { fullName, userName, userEmail, password, role } = req.body;

	// Check for existing user by username and email
	const existingUser = await User.findOne({
		$or: [{ userName }, { userEmail }],
	});

	if (existingUser) {
		// Provide specific feedback for username and email
		if (
			existingUser.userName === userName &&
			existingUser.userEmail === userEmail
		) {
			return res.status(400).json({
				success: false,
				message: "Username and email already exist.",
			});
		} else if (existingUser.userName === userName) {
			return res.status(400).json({
				success: false,
				message: "Username already exists.",
			});
		} else if (existingUser.userEmail === userEmail) {
			return res.status(400).json({
				success: false,
				message: "Email already exists.",
			});
		}
	}

	const hashPassword = await bcrypt.hash(password, 10);

	// Create the new user
	const newUser = new User({
		fullName,
		userName,
		userEmail,
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
	const { userNameOrEmail, userPassword } = req.body;

	// Determine if userNameOrEmail is an email based on the presence of "@" character
	const query = userNameOrEmail.includes("@")
		? { userEmail: userNameOrEmail }
		: { userName: userNameOrEmail };

	// Attempt to find the user based on the constructed query
	const checkUser = await User.findOne(query);

	// const checkUser = await User.findOne({ userEmail });

	if (!checkUser || !(await bcrypt.compare(userPassword, checkUser.password))) {
		return res.status(401).json({
			success: false,
			message:
				"Invalid credentials. \n Please check your username or email and password.",
		});
	}

	const accessToken = jwt.sign(
		{
			_id: checkUser._id,
			fullName: checkUser.fullName,
			userName: checkUser.userName,
			userEmail: checkUser.userEmail,
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
				userName: checkUser.userName,
				userEmail: checkUser.userEmail,
				role: checkUser.role,
			},
		},
	});
};

module.exports = { registerUser, loginUser };
