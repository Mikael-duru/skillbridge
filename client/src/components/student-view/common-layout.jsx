import { Outlet, useLocation } from "react-router-dom";
import StudentViewHeader from "./header";
import StudentViewFooter from "./footer";

function StudentViewCommonLayout() {
	const location = useLocation();
	return (
		<div>
			{!location.pathname.includes("course-progress") ? (
				<StudentViewHeader />
			) : null}
			<Outlet />
			{!location.pathname.includes("course-progress") ? (
				<StudentViewFooter />
			) : null}
		</div>
	);
}

export default StudentViewCommonLayout;
