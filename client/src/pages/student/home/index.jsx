import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

import { courseCategories } from "@/config";
import banner from "/hero-banner.png?url";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context/student-context";
import { checkCoursePurchaseInfo, getStudentCourseList } from "@/lib/actions";
import { AuthContext } from "@/context/auth-context/auth-context";
import { itemVariants, itemVariants3, listVariants } from "@/lib/utils";
import LoadingCircleSpinner from "@/components/ui/loader";

function StudentHomePage() {
	const [itemsPerPage, setItemsPerPage] = useState(30);
	const { loading, setLoading, coursesList, setCoursesList } =
		useContext(StudentContext);
	const { auth } = useContext(AuthContext);

	const navigate = useNavigate();

	// Function to get all course
	const fetchAllCourses = async () => {
		const response = await getStudentCourseList();

		if (response?.success) {
			setCoursesList(response?.data);
			setLoading(false);
		}
	};

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
		const updateItemsPerPage = () => {
			setItemsPerPage(window.innerWidth < 640 ? 16 : 36); // 640px as a breakpoint
		};

		updateItemsPerPage(); // Set initial value
		window.addEventListener("resize", updateItemsPerPage); // Update on resize

		return () => window.removeEventListener("resize", updateItemsPerPage); // Cleanup
	}, []);

	// Sort courses by creation date (newest first)
	const sortedCourses =
		coursesList?.slice().sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		}) || [];

	const currentCoursesList = sortedCourses.slice(0, itemsPerPage);

	return (
		<div className="container mx-auto">
			<main className="bg-white font-inter">
				{/* Banner */}
				<motion.section
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className="flex items-center justify-between gap-10 px-4 py-16 lg:py-24 md:gap-20 max-md:flex-col lg:px-8"
				>
					<div className="space-y-3 lg:space-y-4 xl:pr-16 shrink-0">
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="text-[26.5px] xs:text-4xl max-md:text-center font-bold sm:text-[42px] lg:text-6xl xl:text-[90px] leading-[1]"
						>
							Welcome to{" "}
							<span className="text-[#008080] md:block md:pt-2">
								SkillBridge
							</span>
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: -30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="text-sm max-md:text-center lg:text-base xl:text-lg w-full md:w-[30ch] xl:w-full"
						>
							Your gateway to practical, future-proof tech skills.
						</motion.p>
					</div>
					<motion.figure
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<img
							src={banner}
							width={600}
							height={400}
							loading="lazy"
							className="w-full h-auto rounded-lg shadow-lg"
						/>
					</motion.figure>
				</motion.section>

				{/* Course category */}
				<section className="px-4 py-8 bg-gray-100 lg:px-8">
					<motion.h2
						initial={{ opacity: 0, y: -20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className="mb-6 text-2xl font-bold"
					>
						Course Categories
					</motion.h2>
					<motion.ul
						variants={listVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="grid grid-cols-1 gap-x-6 gap-y-4 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
					>
						{courseCategories.map((categoryItem) => (
							<motion.li
								variants={itemVariants}
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.5 }}
								key={categoryItem.id}
								className="w-full"
							>
								<button
									onClick={() => handleNavigateToCategoryPage(categoryItem.id)}
									className="w-full px-6 py-2 transition-transform duration-300 bg-white border rounded-md shadow-sm hover:scale-[1.005] hover:shadow-lg active:scale-95"
								>
									{categoryItem.label}
								</button>
							</motion.li>
						))}
					</motion.ul>
				</section>

				<section className="px-4 py-16 lg:px-8">
					<motion.h2
						initial={{ opacity: 0, y: -20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className="mb-6 text-2xl font-bold"
					>
						Featured Categories
					</motion.h2>

					{loading ? (
						<LoadingCircleSpinner />
					) : (
						<motion.ul
							key={currentCoursesList?.length || 0}
							variants={listVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
						>
							{currentCoursesList && currentCoursesList.length > 0 ? (
								currentCoursesList.map((courseItem) => (
									<motion.li
										key={courseItem?._id}
										variants={itemVariants3}
										whileHover={{ scale: 1.03 }}
										className="overflow-hidden transition-colors duration-300 border rounded-lg shadow-sm cursor-pointer hover:shadow-lg"
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
										<div className="p-4">
											<h3 className="mb-2 font-bold">{courseItem?.title}</h3>
											<p className="mb-2 text-sm text-gray-700">
												{courseItem?.instructorName}
											</p>
											<p className="text-base font-bold">
												${courseItem?.pricing}
											</p>
										</div>
									</motion.li>
								))
							) : (
								<motion.h1
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									transition={{ duration: 0.8, delay: 0.4 }}
								>
									No Courses yet
								</motion.h1>
							)}
						</motion.ul>
					)}

					{currentCoursesList.length === itemsPerPage && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.5 }}
							className="mt-10 text-center w-[150px] mx-auto"
						>
							<Button
								variant="outline"
								className="border-[#008080] w-full active:scale-95 hover:scale-105 transition-transform duration-300"
							>
								View More
							</Button>
						</motion.div>
					)}
				</section>
			</main>
		</div>
	);
}

export default StudentHomePage;
