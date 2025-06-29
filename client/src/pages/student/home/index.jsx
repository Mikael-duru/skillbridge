import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { courseCategories } from "@/config";
import banner from "/hero-banner.png?url";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context/student-context";
import { checkCoursePurchaseInfo, getStudentCourseList } from "@/lib/actions";
import { AuthContext } from "@/context/auth-context/auth-context";
import Pagination from "@/components/ui/pagination";

const COOKIE_NAME = "currentCoursesList";

function StudentHomePage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [itemsPerPage, setItemsPerPage] = useState(30);
	const { coursesList, setCoursesList } = useContext(StudentContext);
	const { auth } = useContext(AuthContext);

	const navigate = useNavigate();

	useEffect(() => {
		const savedPage = Cookies.get(COOKIE_NAME);
		if (savedPage) {
			setCurrentPage(parseInt(savedPage, 10));
		}
		setIsLoading(false);
	}, []);

	// Function to get all course
	const fetchAllCourses = async () => {
		const response = await getStudentCourseList();

		if (response?.success) setCoursesList(response?.data);
	};

	// Sort courses by creation date (newest first)
	const sortedCourses =
		coursesList?.slice().sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		}) || [];

	const handleNavigateToCategoryPage = (categoryId) => {
		sessionStorage.removeItem("filters");
		const currentFilter = {
			categories: [categoryId],
		};

		sessionStorage.setItem("filters", JSON.stringify(currentFilter));

		navigate("/courses");
	};

	const handleCourseNavigate = async (currentCourseId) => {
		const result = await checkCoursePurchaseInfo(
			currentCourseId,
			auth?.user?._id
		);

		if (result?.success) {
			if (result?.data) {
				navigate(`/student/course-progress/${currentCourseId}`);
			} else {
				navigate(`/course/details/${currentCourseId}`);
			}
		}
	};

	useEffect(() => {
		fetchAllCourses();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			Cookies.set(COOKIE_NAME, currentPage.toString(), { expires: 7 });
		}
	}, [currentPage, isLoading]);

	useEffect(() => {
		const updateItemsPerPage = () => {
			setItemsPerPage(window.innerWidth < 640 ? 15 : 30); // 768px as a breakpoint
		};

		updateItemsPerPage(); // Set initial value
		window.addEventListener("resize", updateItemsPerPage); // Update on resize

		return () => window.removeEventListener("resize", updateItemsPerPage); // Cleanup
	}, []);

	const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentCoursesList = sortedCourses.slice(startIndex, endIndex);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo(0, 0);
	};

	return (
		<div className="container mx-auto">
			<main className="bg-white font-inter">
				{/* Banner */}
				<section className="flex items-center justify-between gap-8 px-4 py-8 sm:pt-10 lg:gap-6 max-lg:flex-col lg:px-8">
					<div className="text-center lg:pr-4 xl:pr-12 shrink-0 max-lg:pt-4">
						<h1 className="xl:mb-2 text-2xl font-bold sm:mb-1 sm:text-[40px] xl:text-5xl">
							Welcome to SkillBridge
						</h1>
						<p className="text-sm text-center sm:text-base xl:text-lg">
							Empowering Learners with Cutting-Edge Tech Education
						</p>
					</div>
					<div className="lg:w-full max-lg:mb-8">
						<img
							src={banner}
							width={600}
							height={400}
							loading="lazy"
							className="w-full h-auto rounded-lg shadow-lg"
						/>
					</div>
				</section>

				{/* Course category */}
				<section className="px-4 py-8 bg-gray-100 lg:px-8">
					<h2 className="mb-6 text-2xl font-bold">Course Categories</h2>
					<div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
						{courseCategories.map((categoryItem) => (
							<Button
								variant="outline"
								key={categoryItem.id}
								onClick={() => handleNavigateToCategoryPage(categoryItem.id)}
							>
								{categoryItem.label}
							</Button>
						))}
					</div>
				</section>

				<section className="px-4 py-12 lg:px-8">
					<h2 className="mb-6 text-2xl font-bold">Featured Categories</h2>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{currentCoursesList && currentCoursesList.length > 0 ? (
							currentCoursesList.map((courseItem) => (
								<div
									className="overflow-hidden border rounded-lg shadow cursor-pointer"
									key={courseItem?._id}
									onClick={() => handleCourseNavigate(courseItem?._id)}
								>
									<img
										src={courseItem?.image?.imageUrl}
										alt="Course banner"
										width={300}
										height={150}
										className="object-cover w-full h-48"
										loading="lazy"
									/>
									<div className="p-4 ">
										<h3 className="mb-2 font-bold">{courseItem?.title}</h3>
										<p className="mb-2 text-sm text-gray-700">
											{courseItem?.instructorName}
										</p>
										<p className="text-base font-bold">
											${courseItem?.pricing}
										</p>
									</div>
								</div>
							))
						) : (
							<h1>No Courses yet</h1>
						)}
					</div>

					{totalPages > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</section>
			</main>
		</div>
	);
}

export default StudentHomePage;
