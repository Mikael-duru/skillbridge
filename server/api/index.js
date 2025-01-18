require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("../routes/auth-routes/index");
const mediaRoutes = require("../routes/instructor-routes/media-routes");
const instructorCoursesRoutes = require("../routes/instructor-routes/course-routes");
const studentCoursesRoutes = require("../routes/student-routes/course-routes");
const studentOrderRoutes = require("../routes/student-routes/order-routes");
const studentBoughtCoursesRoutes = require("../routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("../routes/student-routes/course-progress-routes");

// Create the node app
const app = express();

// Set up port, db url, and cors
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const corsOptions = {
	origin: process.env.CLIENT_URL || "*",
	methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Handling middleware
app.use(express.json());

// db connection
mongoose
	.connect(MONGODB_URI)
	.then(() => console.log("MongoDb is connected"))
	.catch((e) => console.log(e));

// Server display message
app.get("/", (req, res) => res.status(200).json({ message: "Hello World" }));

// parent routes config - e.g /<parent-route-name>/main-endpoint
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCoursesRoutes);
app.use("/student/course", studentCoursesRoutes);
app.use("/student/order", studentOrderRoutes);
app.use("/student/bought-courses", studentBoughtCoursesRoutes);
app.use("/student/courses-progress", studentCourseProgressRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).json({
		success: false,
		message: "Something went wrong!",
	});
});

app.listen(PORT, () => {
	console.log(`Server is now running on port ${PORT}`);
});
