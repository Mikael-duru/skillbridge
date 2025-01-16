const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
	try {
		const courseData = req.body;
		const newlyCreatedCourse = new Course(courseData);
		const saveCourse = await newlyCreatedCourse.save();

		if (saveCourse) {
			res.status(200).json({
				success: true,
				message: "Course created successfully!",
				data: saveCourse,
			});
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred!",
		});
	}
};

const getAllCourses = async (req, res) => {
	try {
		const courseList = await Course.find({});

		res.status(200).json({
			success: true,
			data: courseList,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred!",
		});
	}
};

// const getCoursesById = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const instructorCourses = await Course.findById(id);

// 		if (!instructorCourses) {
// 			return res.status(404).json({
// 				success: false,
// 				message: "Course not found",
// 			});
// 		}

// 		res.status(200).json({
// 			success: true,
// 			data: instructorCourses,
// 		});
// 	} catch (e) {
// 		console.log(e);
// 		res.status(500).json({
// 			success: false,
// 			message: "Some error occurred!",
// 		});
// 	}
// };

const getCourseDetailsById = async (req, res) => {
	try {
		const { id } = req.params;
		const courseDetails = await Course.findById(id);

		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		res.status(200).json({
			success: true,
			data: courseDetails,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred!",
		});
	}
};

const updateCourseById = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedCourseData = req.body;

		const updatedCourse = await Course.findByIdAndUpdate(
			id,
			updatedCourseData,
			{ new: true }
		);

		if (!updatedCourse) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Course updated successfully!",
			data: updatedCourse,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred!",
		});
	}
};

module.exports = {
	addNewCourse,
	getAllCourses,
	// getCoursesById,
	getCourseDetailsById,
	updateCourseById,
};
