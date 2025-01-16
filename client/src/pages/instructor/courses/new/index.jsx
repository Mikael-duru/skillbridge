import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GraduationCap } from "lucide-react";

import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseDetails from "@/components/instructor-view/courses/add-new-course/course-landing-page";
import CourseBanner from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { instructorContext } from "@/context/instructor-context/instructor-context";
import { AuthContext } from "@/context/auth-context/auth-context";
import {
	addNewCourse,
	getCourseDetailsById,
	updateCourseById,
} from "@/lib/actions";
import {
	CourseCurriculumInitialFormData,
	courseLandingInitialFormData,
} from "@/config";

function AddNewCoursePage() {
	const [activeTab, setActiveTab] = useState(
		() => sessionStorage.getItem("createCourseTab") || "curriculum"
	);

	const {
		courseLandingFormData,
		courseCurriculumFormData,
		setCourseLandingFormData,
		setCourseCurriculumFormData,
		currentEditedCourseId,
		setCurrentEditedCourseId,
	} = useContext(instructorContext);

	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();
	const params = useParams();

	const isEmpty = (value) => {
		if (Array.isArray(value)) {
			return value.length === 0;
		}

		return value === "" || value === null || value === undefined;
	};

	const validateFormdata = () => {
		for (const key in courseLandingFormData) {
			if (isEmpty(courseLandingFormData[key])) {
				return false;
			}
		}

		// Check if the image object has valid data
		const { imageUrl, public_id } = courseLandingFormData.image;
		if (isEmpty(imageUrl) || isEmpty(public_id)) {
			return false;
		}

		let hasFreePreview = false;

		for (const item of courseCurriculumFormData) {
			if (
				isEmpty(item.title) ||
				isEmpty(item.videoUrl) ||
				isEmpty(item.public_id)
			) {
				return false;
			}

			if (item.freePreview) {
				hasFreePreview = true; //found at least one free preview
			}
		}

		return hasFreePreview;
	};

	const handleCreateCourse = async () => {
		const courseFinalFormData = {
			instructorId: auth?.user?._id,
			instructorName: auth?.user?.fullName,
			date: new Date(),
			...courseLandingFormData,
			// students: [],
			curriculum: courseCurriculumFormData,
			isPublished: true,
		};

		const response =
			currentEditedCourseId !== null
				? await updateCourseById(currentEditedCourseId, courseFinalFormData)
				: await addNewCourse(courseFinalFormData);

		if (response.success) {
			setCourseLandingFormData(courseLandingInitialFormData);
			setCourseCurriculumFormData(CourseCurriculumInitialFormData);
			navigate(-1);
		}
	};

	const fetchCurrentCourseDetails = async () => {
		const response = await getCourseDetailsById(currentEditedCourseId);

		if (response.success) {
			const setCourseFormData = Object.keys(
				courseLandingInitialFormData
			).reduce((acc, key) => {
				acc[key] = response?.data[key] || courseLandingInitialFormData[key];

				return acc;
			}, {});

			setCourseLandingFormData(setCourseFormData);
			setCourseCurriculumFormData(response?.data?.curriculum);
		}
	};

	useEffect(() => {
		if (currentEditedCourseId !== null) {
			fetchCurrentCourseDetails();
		}
	}, [currentEditedCourseId]);

	useEffect(() => {
		if (params?.courseId) setCurrentEditedCourseId(params?.courseId ?? null);
	}, [params?.courseId]);

	useEffect(() => {
		// Update sessionStorage whenever activeTab changes
		sessionStorage.setItem("createCourseTab", activeTab);
	}, [activeTab]);

	return (
		<div className="container mx-auto">
			<header className="flex items-center justify-between px-4 border-b lg:px-6 h-14 shrink-0 font-inter">
				<Link
					to={"/"}
					className="flex items-center justify-center text-[#008080] hover:text-[#007070]"
				>
					<GraduationCap className="w-8 h-8 mr-3" />
					<span className="font-extrabold text-sm sm:text-base tracking-[0.02em]">
						SkillBridge
					</span>
				</Link>

				<Button variant="secondary" onClick={() => navigate(-1)}>
					Back
				</Button>
			</header>

			<main className="p-4 my-5 font-inter">
				<div className="flex justify-between gap-5">
					<h1 className="mb-10 text-2xl font-extrabold sm:text-3xl lato ">
						Create Course
					</h1>
					<Button
						className="px-5 text-sm font-bold tracking-wider sm:px-8"
						variant="secondary"
						disabled={!validateFormdata()}
						onClick={handleCreateCourse}
					>
						SUBMIT
					</Button>
				</div>
				<Card>
					<CardContent className="max-sm:px-3">
						<div className="container pt-4 mx-auto">
							<Tabs
								defaultValue="curriculum"
								value={activeTab}
								onValueChange={(value) => setActiveTab(value)}
								className="space-y-4"
							>
								<TabsList className="h-full max-sm:inline-block">
									<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
									<TabsTrigger value="course-details">
										Course Details
									</TabsTrigger>
									<TabsTrigger value="course-banner">Course Banner</TabsTrigger>
								</TabsList>
								<TabsContent value="curriculum">
									<CourseCurriculum />
								</TabsContent>
								<TabsContent value="course-details">
									<CourseDetails />
								</TabsContent>
								<TabsContent value="course-banner">
									<CourseBanner />
								</TabsContent>
							</Tabs>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}

export default AddNewCoursePage;
