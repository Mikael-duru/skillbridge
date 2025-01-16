const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const getAllStudentViewCoursesList = async (req, res) => {
	try {
		const {
			categories = [],
			levels = [],
			primaryLanguages = [],
			sortBy = "price-lowtohigh",
		} = req.query;

		let filters = {};

		if (categories.length) {
			filters.category = { $in: categories.split(",") };
		}
		if (levels.length) {
			filters.level = { $in: levels.split(",") };
		}
		if (primaryLanguages.length) {
			filters.primaryLanguage = { $in: primaryLanguages.split(",") };
		}

		let sortParam = {};

		switch (sortBy) {
			case "price-lowtohigh":
				sortParam.pricing = 1;
				break;
			case "price-hightolow":
				sortParam.pricing = -1;
				break;
			case "title-atoz":
				sortParam.title = 1;
				break;
			case "title-ztoa":
				sortParam.title = -1;
				break;
			default:
				sortParam.pricing = 1;
				break;
		}

		const courseList = await Course.find(filters).sort(sortParam);

		res.status(200).json({
			success: true,
			data: courseList,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Something went wrong!",
		});
	}
};

const getStudentViewCourseDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const courseDetails = await Course.findById(id);

		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: "No course details found",
				data: null,
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
			message: "Something went wrong!",
		});
	}
};

const checkCoursePurchaseInfo = async (req, res) => {
	try {
		const { id, studentId } = req.params;

		// check if the current student purchased this course
		const studentCourses = await StudentCourses.findOne({
			studentId: studentId,
		});

		const ifStudentAlreadyBoughtTheCourse =
			studentCourses?.courses?.findIndex((item) => item.courseId === id) > -1;

		res.status(200).json({
			success: true,
			data: ifStudentAlreadyBoughtTheCourse,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Something went wrong!",
		});
	}
};

module.exports = {
	getAllStudentViewCoursesList,
	getStudentViewCourseDetails,
	checkCoursePurchaseInfo,
};
