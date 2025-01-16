const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	fullName: String,
	userName: String,
	userEmail: String,
	password: String,
	role: String,
});

module.exports = mongoose.model("User", userSchema);
