import { useState } from "react";
import { StudentContext } from "./student-context";

export default function StudentProvider({ children }) {
	const [coursesList, setCoursesList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [studentViewCourseDetails, setStudentViewCourseDetails] =
		useState(null);
	const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
	const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
	const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
		useState({});

	return (
		<StudentContext.Provider
			value={{
				coursesList,
				setCoursesList,
				loading,
				setLoading,
				studentViewCourseDetails,
				setStudentViewCourseDetails,
				currentCourseDetailsId,
				setCurrentCourseDetailsId,
				studentBoughtCoursesList,
				setStudentBoughtCoursesList,
				studentCurrentCourseProgress,
				setStudentCurrentCourseProgress,
			}}
		>
			{children}
		</StudentContext.Provider>
	);
}
