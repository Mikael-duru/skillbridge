import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";

import AuthPage from "./pages/auth";
import ProtectedRoutes from "./components/protected-route";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/non-found";
import AddNewCoursePage from "./pages/instructor/courses/new";
import { AuthContext } from "./context/auth-context/auth-context";
import StudentViewCoursesPage from "./pages/student/courses";
import CourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentSuccessfulPage from "./pages/student/payment/verification";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";

function App() {
	const { auth } = useContext(AuthContext);

	return (
		<>
			{/* Toast container */}
			<ToastContainer position="top-center" autoClose={3000} />

			<Routes>
				<Route
					path="/auth"
					element={
						<ProtectedRoutes
							element={<AuthPage />}
							authenticated={auth?.authenticate}
							user={auth?.user}
						/>
					}
				/>

				{/* INSTRUCTOR ROUTES */}
				<Route
					path="/instructor"
					element={
						<ProtectedRoutes
							element={<InstructorDashboardPage />}
							authenticated={auth?.authenticate}
							user={auth?.user}
						/>
					}
				/>
				<Route
					path="/instructor/courses/new"
					element={
						<ProtectedRoutes
							element={<AddNewCoursePage />}
							authenticated={auth?.authenticate}
							user={auth?.user}
						/>
					}
				/>
				<Route
					path="/instructor/courses/edit/:courseId"
					element={
						<ProtectedRoutes
							element={<AddNewCoursePage />}
							authenticated={auth?.authenticate}
							user={auth?.user}
						/>
					}
				/>

				{/* STUDENT ROUTES */}
				<Route
					path="/"
					element={
						<ProtectedRoutes
							element={<StudentViewCommonLayout />}
							authenticated={auth?.authenticate}
							user={auth?.user}
						/>
					}
				>
					<Route path="" element={<StudentHomePage />} />
					<Route path="home" element={<StudentHomePage />} />
					<Route path="courses" element={<StudentViewCoursesPage />} />
					<Route path="course/details/:id" element={<CourseDetailsPage />} />
					<Route
						path="payment/verification"
						element={<PaypalPaymentSuccessfulPage />}
					/>
					<Route path="student/course/list" element={<StudentCoursesPage />} />
					<Route
						path="student/course-progress/:id"
						element={<StudentViewCourseProgressPage />}
					/>
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
}

export default App;
