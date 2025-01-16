import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { instructorContext } from "@/context/instructor-context/instructor-context";
import { useContext } from "react";

function CourseDetails() {
	const { courseLandingFormData, setCourseLandingFormData } =
		useContext(instructorContext);

	return (
		<section className="font-inter">
			<Card>
				<CardHeader className="max-sm:px-3">
					<CardTitle>Course Details</CardTitle>
				</CardHeader>
				<CardContent className="max-sm:px-3">
					<FormControls
						formControls={courseLandingPageFormControls}
						formData={courseLandingFormData}
						setFormData={setCourseLandingFormData}
					/>
				</CardContent>
			</Card>
		</section>
	);
}

export default CourseDetails;
