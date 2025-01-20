import { useContext, useEffect, useState } from "react";
import { Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { StudentContext } from "@/context/student-context/student-context";
import { getStudentBoughtCourseById } from "@/lib/actions";
import { AuthContext } from "@/context/auth-context/auth-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Pagination from "@/components/ui/pagination";

const COOKIE_NAME = "currentBoughtCoursesList";

function StudentCoursesPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [itemsPerPage, setItemsPerPage] = useState(30);
	const { auth } = useContext(AuthContext);
	const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
		useContext(StudentContext);

	const navigate = useNavigate();

	useEffect(() => {
		const savedPage = Cookies.get(COOKIE_NAME);
		if (savedPage) {
			setCurrentPage(parseInt(savedPage, 10));
		}
		setIsLoading(false);
	}, []);

	const fetchStudentBoughtCourses = async () => {
		const result = await getStudentBoughtCourseById(auth?.user?._id);

		if (result?.success) {
			setStudentBoughtCoursesList(result?.data);
		}
	};

	useEffect(() => {
		fetchStudentBoughtCourses();
	}, []);

	const isCourseBought = JSON.parse(sessionStorage.getItem("isCourseBought"));

	useEffect(() => {
		if (isCourseBought) {
			fetchStudentBoughtCourses();
			sessionStorage.removeItem("isCourseBought");
		}
	}, [isCourseBought]);

	// Sort courses by date of purchase (newest first)
	const sortedStudentBoughtCourses =
		studentBoughtCoursesList?.slice().sort((a, b) => {
			return new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase);
		}) || [];

	useEffect(() => {
		if (!isLoading) {
			Cookies.set(COOKIE_NAME, currentPage.toString(), { expires: 7 });
		}
	}, [currentPage, isLoading]);

	useEffect(() => {
		const updateItemsPerPage = () => {
			setItemsPerPage(window.innerWidth < 640 ? 15 : 30); // 640px as a breakpoint
		};

		updateItemsPerPage(); // Set initial value
		window.addEventListener("resize", updateItemsPerPage); // Update on resize

		return () => window.removeEventListener("resize", updateItemsPerPage); // Cleanup
	}, []);

	const totalPages = Math.ceil(
		sortedStudentBoughtCourses.length / itemsPerPage
	);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentBoughtCoursesList = sortedStudentBoughtCourses.slice(
		startIndex,
		endIndex
	);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo(0, 0);
	};

	return (
		<main className="container p-4 mx-auto font-inter">
			<h1 className="mt-4 mb-8 text-3xl font-bold">My Courses</h1>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{currentBoughtCoursesList && currentBoughtCoursesList.length > 0 ? (
					currentBoughtCoursesList.map((course) => (
						<Card key={course?.courseId} className="flex flex-col">
							<CardContent className="flex-grow p-4">
								<img
									src={course?.courseImage}
									alt={course?.title}
									className="object-cover w-full mb-4 rounded-md h-52"
								/>
								<h3 className="mb-1 text-sm font-bold">{course?.title}</h3>
								<p className="mb-2 text-sm text-gray-700">
									{course?.instructorName}
								</p>
							</CardContent>
							<CardFooter>
								<Button
									onClick={() =>
										navigate(`/student/course-progress/${course?.courseId}`)
									}
									className="flex-1"
								>
									<Watch className="mr-2 size-4" />
									Start watching
								</Button>
							</CardFooter>
						</Card>
					))
				) : (
					<h1 className="col-span-4 text-2xl font-medium">
						You have not bought a course yet!
					</h1>
				)}
			</div>

			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</main>
	);
}

export default StudentCoursesPage;
