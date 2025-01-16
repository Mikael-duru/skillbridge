import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { instructorContext } from "@/context/instructor-context/instructor-context";
import {
	CourseCurriculumInitialFormData,
	courseLandingInitialFormData,
} from "@/config";
import DataTable from "@/components/table/data-table";
import { columns } from "@/components/table/course-column";

function InstructorCourses({ listOfCourses }) {
	const navigate = useNavigate();
	const {
		setCurrentEditedCourseId,
		setCourseLandingFormData,
		setCourseCurriculumFormData,
	} = useContext(instructorContext);

	return (
		<main className="mt-10 font-inter">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between max-md:px-3">
					<CardTitle className="text-xl font-extrabold sm:text-3xl lato">
						All Courses
					</CardTitle>
					<Button
						className="md:p-6"
						variant="secondary"
						onClick={() => {
							setCurrentEditedCourseId(null);
							setCourseLandingFormData(courseLandingInitialFormData);
							setCourseCurriculumFormData(CourseCurriculumInitialFormData);
							navigate("/instructor/courses/new");
						}}
					>
						<Plus />
						<span className="max-md:hidden">Create New Course</span>
					</Button>
				</CardHeader>
				<CardContent className="max-md:p-2">
					<div className="overflow-x-auto max-x:w-[265px]">
						<DataTable
							data={listOfCourses}
							columns={columns}
							searchKey="title"
						/>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}

export default InstructorCourses;
