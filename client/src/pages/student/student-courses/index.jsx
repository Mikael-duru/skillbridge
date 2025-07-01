import { useContext, useEffect, useState } from "react";
import { Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

import { StudentContext } from "@/context/student-context/student-context";
import { getStudentBoughtCourseById } from "@/lib/actions";
import { AuthContext } from "@/context/auth-context/auth-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Pagination from "@/components/ui/pagination";
import LoadingCircleSpinner from "@/components/ui/loader";
import { itemVariants3, listVariants } from "@/lib/utils";

const COOKIE_NAME = "currentBoughtCoursesList";

function StudentCoursesPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [itemsPerPage, setItemsPerPage] = useState(30);
	const { auth } = useContext(AuthContext);
	const {
		loading,
		setLoading,
		studentBoughtCoursesList,
		setStudentBoughtCoursesList,
	} = useContext(StudentContext);

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
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStudentBoughtCourses();
	}, []);

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
			setItemsPerPage(window.innerWidth < 640 ? 16 : 36); // 640px as a breakpoint
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
		<motion.main
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 1 }}
			className="container p-4 mx-auto font-inter"
		>
			<motion.h1
				initial={{ opacity: 0, y: -30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="pt-6 pb-8 text-3xl font-bold"
			>
				My Courses
			</motion.h1>

			<motion.ul
				key={currentBoughtCoursesList?.length || 0}
				variants={listVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
			>
				{currentBoughtCoursesList && currentBoughtCoursesList.length > 0 ? (
					currentBoughtCoursesList.map((course) => (
						<motion.li
							key={course?.courseId}
							variants={itemVariants3}
							whileHover={{ scale: 1.03 }}
						>
							<Card className="flex flex-col">
								<CardContent className="flex-grow p-4">
									<img
										src={course?.courseImage}
										alt={course?.title}
										className="object-cover w-full mb-4 rounded-md h-52"
										loading="lazy"
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
						</motion.li>
					))
				) : loading ? (
					<LoadingCircleSpinner />
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 1 }}
						className="flex flex-col items-center justify-center col-span-4 gap-6 h-[50vh]"
					>
						<h1 className="text-2xl font-medium text-center">
							You have not bought a course yet!
						</h1>
						<Button variant="secondary" onClick={() => navigate("/courses")}>
							Buy a Course
						</Button>
					</motion.div>
				)}
			</motion.ul>

			{totalPages > 1 && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.5 }}
				>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</motion.div>
			)}
		</motion.main>
	);
}

export default StudentCoursesPage;
