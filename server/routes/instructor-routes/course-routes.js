const express = require("express");
const {
	addNewCourse,
	getAllCourses,
	getCoursesById,
	getCourseDetailsById,
	updateCourseById,
} = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
// router.get("/get/:id", getCoursesById);
router.get("/get/details/:id", getCourseDetailsById);
router.put("/update/:id", updateCourseById);

module.exports = router;
