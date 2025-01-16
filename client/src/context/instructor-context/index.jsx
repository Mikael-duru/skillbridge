import { useState } from "react";
import { instructorContext } from "./instructor-context";
import {
	CourseCurriculumInitialFormData,
	courseLandingInitialFormData,
} from "@/config";

export default function InstructorProvider({ children }) {
	const [courseLandingFormData, setCourseLandingFormData] = useState(
		courseLandingInitialFormData
	);
	const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
		CourseCurriculumInitialFormData
	);
	const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
	const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
		useState(0);
	const [instructorCoursesList, setInstructorCoursesList] = useState([]);
	const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

	return (
		<instructorContext.Provider
			value={{
				courseLandingFormData,
				setCourseLandingFormData,
				courseCurriculumFormData,
				setCourseCurriculumFormData,
				mediaUploadProgress,
				setMediaUploadProgress,
				mediaUploadProgressPercentage,
				setMediaUploadProgressPercentage,
				instructorCoursesList,
				setInstructorCoursesList,
				currentEditedCourseId,
				setCurrentEditedCourseId,
			}}
		>
			{children}
		</instructorContext.Provider>
	);
}
