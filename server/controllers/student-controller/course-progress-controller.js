const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// mark lecture as viewed
const markLectureAsViewed = async (req, res) => {
	try {
		const { studentId, courseId, lectureId } = req.body;

		let progress = await CourseProgress.findOne({ studentId, courseId });

		if (!progress) {
			progress = new CourseProgress({
				studentId,
				courseId,
				lecturesProgress: [
					{
						lectureId,
						viewed: true,
						dateViewed: new Date(),
					},
				],
			});

			await progress.save();
		} else {
			const lecturesProgress = progress?.lecturesProgress?.find(
				(item) => item?.lectureId === lectureId
			);

			if (lecturesProgress) {
				lecturesProgress.viewed = true;
				lecturesProgress.dateViewed = new Date();
			} else {
				progress?.lecturesProgress?.push({
					lectureId,
					viewed: true,
					dateViewed: new Date(),
				});
			}

			await progress.save();
		}

		const course = await Course.findById(courseId);

		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		// Check the view status of all the courses
		const allLecturesViewed =
			progress?.lecturesProgress?.length === course?.curriculum.length &&
			progress?.lecturesProgress?.every((item) => item.viewed);

		if (allLecturesViewed) {
			(progress.completed = true), (progress.completionDate = new Date());

			await progress.save();
		}

		res.status(200).json({
			success: true,
			message: "Lecture marked as viewed",
			data: progress,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Error occurred while marking course as viewed!",
		});
	}
};

// get current course progress
const getCurrentCourseProgress = async (req, res) => {
	try {
		const { studentId, courseId } = req.params;

		const studentPurchasedCourses = await StudentCourses.findOne({ studentId });

		const isCurrentCoursePurchasedByStudent =
			studentPurchasedCourses?.courses?.findIndex(
				(item) => item.courseId === courseId
			) > -1;

		if (!isCurrentCoursePurchasedByStudent) {
			return res.status(200).json({
				success: true,
				data: {
					isPurchased: false,
				},
				message: "You need to buy this course to access it",
			});
		}

		const studentCourseProgress = await CourseProgress.findOne({
			studentId,
			courseId,
		});

		if (
			!studentCourseProgress ||
			studentCourseProgress?.lecturesProgress?.length === 0
		) {
			const course = await Course.findById(courseId);
			if (!course) {
				return res.status(404).json({
					success: false,
					message: "Course not found",
				});
			}

			return res.status(200).json({
				success: true,
				message: "No progress found for this course",
				data: {
					courseDetails: course,
					progress: [],
					isPurchased: true,
				},
			});
		}

		const courseDetails = await Course.findById(courseId);

		res.status(200).json({
			success: true,
			data: {
				courseDetails,
				progress: studentCourseProgress?.lecturesProgress,
				completed: studentCourseProgress?.completed,
				completionDate: studentCourseProgress?.completionDate,
				isPurchased: true,
			},
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Error occurred while getting course progress!",
		});
	}
};

// reset course progress
const resetCourseProgress = async (req, res) => {
	try {
		const { studentId, courseId } = req.body;

		const progress = await CourseProgress.findOne({ studentId, courseId });

		if (!progress) {
			return res.status(404).json({
				success: false,
				message: "Course progress not found",
			});
		}

		(progress.lecturesProgress = []),
			(progress.completed = false),
			(progress.completionDate = null),
			await progress.save();

		res.status(200).json({
			success: true,
			message: "Course progress reset successfully!",
			data: progress,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Error occurred while resetting course progress!",
		});
	}
};

module.exports = {
	markLectureAsViewed,
	getCurrentCourseProgress,
	resetCourseProgress,
};
