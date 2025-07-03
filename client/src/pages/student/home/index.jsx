import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { courseCategories } from "@/config";
import banner from "/skillbridge-hero-banner.png";
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
				window.location.href = `/course/details/${currentCourseId}`;
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
		<motion.main
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 1 }}
			className="font-inter"
		>
			<div className="container mx-auto bg-white">
				{/* Banner */}
				<motion.section className="grid items-center grid-cols-1 gap-16 px-6 py-16 lg:px-8 lg:grid-cols-2">
					<div className="xl:pr-16 shrink-0 max-lg:text-center">
						<motion.h1
							initial={{ x: -20, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-4xl font-bold xl:mb-4 xl:text-6xl"
						>
							Gain Future-Proof Tech Skills
						</motion.h1>

						<motion.p
							initial={{ x: -30, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.5 }}
							className="mt-1.5 mb-6 text-base sm:text-lg xl:mb-8 xl:text-xl text-zinc-600 lg:w-[35ch] xl:w-full"
						>
							Learn. Build. Succeed — with flexible online courses.
						</motion.p>

						<motion.a
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 1, delay: 0.7 }}
							href="/courses"
							className="inline-block px-8 py-3 text-lg font-semibold text-white rounded-full bg-[#008080] active:scale-95"
						>
							Let&apos;s Get Started
						</motion.a>
					</div>
					<motion.figure
						initial={{ scale: 0 }}
						whileInView={{ scale: 1 }}
						transition={{
							duration: 0.8,
							type: "spring",
							stiffness: 50,
						}}
						className="overflow-hidden border rounded-lg shadow-lg border-[#008080]/20 shrink-0"
					>
						<img
							src={banner}
							width={600}
							height={400}
							alt="Student learning online with SkillBridge LMS platform"
							loading="lazy"
							className="object-cover w-full h-auto"
						/>
					</motion.figure>
				</motion.section>

				{/* Course category */}
				<section className="px-4 pt-8 pb-10 bg-gray-100 lg:px-8">
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
						className="grid gap-x-6 gap-y-4 pb-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]"
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
						) : loading ? (
							<div className="col-span-4">
								<LoadingCircleSpinner />
							</div>
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
								View All Courses
							</Button>
						</motion.div>
					)}
				</section>
			</div>
		</motion.main>
	);
}

export default StudentHomePage;
