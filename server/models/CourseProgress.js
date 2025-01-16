const mongoose = require("mongoose");

const LectureProgressSchema = new mongoose.Schema({
	lectureId: String,
	viewed: Boolean,
	dateViewed: Date,
});

const CourseProgressSchema = new mongoose.Schema({
	studentId: String,
	courseId: String,
	completed: Boolean,
	completionDate: Date,
	lecturesProgress: [LectureProgressSchema],
});

module.exports = mongoose.model("CourseProgress", CourseProgressSchema);
