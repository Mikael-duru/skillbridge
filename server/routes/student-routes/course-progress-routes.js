const express = require("express");
const {
	getCurrentCourseProgress,
	markLectureAsViewed,
	resetCourseProgress,
} = require("../../controllers/student-controller/course-progress-controller");

const router = express.Router();

router.get("/get/:studentId/:courseId", getCurrentCourseProgress);
router.post("/mark-lecture-as-viewed", markLectureAsViewed);
router.post("/reset-course-progress", resetCourseProgress);

module.exports = router;
