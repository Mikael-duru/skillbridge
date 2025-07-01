import { useContext, useEffect, useState } from "react";
import { ArrowUpDownIcon, ListFilter, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config";
import { StudentContext } from "@/context/student-context/student-context";
import { checkCoursePurchaseInfo, getStudentCourseList } from "@/lib/actions";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context/auth-context";
import Pagination from "@/components/ui/pagination";
import LoadingCircleSpinner from "@/components/ui/loader";
import { containerVariants, itemYVariants } from "@/lib/utils";

const createSearchParamsHelper = (filterParams) => {
	const queryParams = [];

	for (const [key, value] of Object.entries(filterParams)) {
		if (Array.isArray(value) && value.length > 0) {
			const paramValue = value.join(",");

			queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
		}
	}

	return queryParams.join("&");
};

const COOKIE_NAME = "currentCourses";

function StudentViewCoursesPage() {
	const [openFilter, setOpenFilter] = useState(false);
	const [sort, setSort] = useState("price-lowtohigh");
	const [filters, setFilters] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [itemsPerPage, setItemsPerPage] = useState(30);
	// eslint-disable-next-line no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { auth } = useContext(AuthContext);
	const { coursesList, setCoursesList, loading, setLoading } =
		useContext(StudentContext);

	useEffect(() => {
		const savedPage = Cookies.get(COOKIE_NAME);
		if (savedPage) {
			setCurrentPage(parseInt(savedPage, 10));
		}
		setIsLoading(false);
	}, []);

	const fetchAllCourses = async (filters, sort) => {
		const query = new URLSearchParams({ ...filters, sortBy: sort });

		const result = await getStudentCourseList(query);

		if (result?.success) {
			setCoursesList(result?.data);
			setLoading(false);
		} else {
			setCoursesList(null);
			setLoading(false);
		}
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

	const handleFilterOnChange = (filterSectionId, currentOption) => {
		let copyFilters = { ...filters };
		const indexOfCurrentFilterSection =
			Object.keys(copyFilters).indexOf(filterSectionId);

		if (indexOfCurrentFilterSection === -1) {
			copyFilters = {
				...copyFilters,
				[filterSectionId]: [currentOption],
			};
		} else {
			const indexOfCurrentOption =
				copyFilters[filterSectionId].indexOf(currentOption);

			if (indexOfCurrentOption === -1)
				copyFilters[filterSectionId].push(currentOption);
			else copyFilters[filterSectionId].splice(indexOfCurrentOption, 1);
		}

		setFilters(copyFilters);
		sessionStorage.setItem("filters", JSON.stringify(copyFilters));
	};

	useEffect(() => {
		const createQueryStringForFilters = createSearchParamsHelper(filters);

		setSearchParams(new URLSearchParams(createQueryStringForFilters));
	}, [filters]);

	useEffect(() => {
		setSort("price-lowtohigh");
		setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
	}, []);

	useEffect(() => {
		if (filters !== null && sort !== null) fetchAllCourses(filters, sort);
	}, [filters, sort]);

	useEffect(() => {
		return () => {
			sessionStorage.removeItem("filters");
		};
	}, []);

	useEffect(() => {
		if (!isLoading) {
			Cookies.set(COOKIE_NAME, currentPage.toString(), { expires: 7 });
		}
	}, [currentPage, isLoading]);

	useEffect(() => {
		const updateItemsPerPage = () => {
			setItemsPerPage(window.innerWidth < 640 ? 16 : 36); // 768px as a breakpoint
		};

		updateItemsPerPage(); // Set initial value
		window.addEventListener("resize", updateItemsPerPage); // Update on resize

		return () => window.removeEventListener("resize", updateItemsPerPage);
	}, []);

	const totalPages = Math.ceil(coursesList.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentCoursesList = coursesList.slice(startIndex, endIndex);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo(0, 0);
	};

	return (
		<motion.main
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 1 }}
			className="container relative p-4 mx-auto font-inter"
		>
			<motion.h1
				initial={{ opacity: 0, y: -30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="pt-6 pb-4 text-3xl font-bold"
			>
				All Courses
			</motion.h1>

			{loading ? (
				<LoadingCircleSpinner />
			) : (
				<div className="flex gap-4 max-lg:flex-col">
					<aside className="w-full space-y-4 lg:w-64 max-lg:hidden">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							{Object.keys(filterOptions).map((keyItem) => (
								<div className="p-4 border-b" key={keyItem}>
									<h3 className="mb-3 font-bold capitalize">
										{keyItem.replace(/([a-z])([A-Z])/g, "$1 $2")}
									</h3>
									<div className="grid gap-2 mt-2">
										{filterOptions[keyItem].map((option) => (
											<Label
												className="flex items-center gap-3 font-medium"
												key={option.id}
											>
												<Checkbox
													checked={
														filters &&
														Object.keys(filters).length > 0 &&
														filters[keyItem] &&
														filters[keyItem].indexOf(option.id) > -1
													}
													onCheckedChange={() =>
														handleFilterOnChange(keyItem, option?.id)
													}
												/>
												{option.label}
											</Label>
										))}
									</div>
								</div>
							))}
						</motion.div>
					</aside>
					<section className="flex-1 sm:pr-2">
						<div className="flex items-center justify-end gap-5 mb-4">
							<motion.button
								initial={{ opacity: 0, y: -30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="p-2 lg:hidden"
								onClick={() => setOpenFilter(!openFilter)}
							>
								<ListFilter className="size-5" />
							</motion.button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<motion.div
										initial={{ opacity: 0, y: -30 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: 0.5 }}
									>
										<Button
											variant="outline"
											size="sm"
											className="flex items-center gap-2 p-5 font-inter"
										>
											<ArrowUpDownIcon className="size-4" />
											<span className="text-base font-medium">Sort By</span>
										</Button>
									</motion.div>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-[200px]">
									<DropdownMenuRadioGroup
										value={sort}
										onValueChange={(value) => setSort(value)}
									>
										{sortOptions.map((sortItem) => (
											<DropdownMenuRadioItem
												key={sortItem.id}
												value={sortItem.id}
											>
												{sortItem.label}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
							<motion.span
								initial={{ opacity: 0, y: -30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.7 }}
								className="text-sm font-bold text-black"
							>
								{coursesList.length} Results
							</motion.span>
						</div>

						{openFilter && (
							<motion.div
								initial={{ opacity: 0, x: 10 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className={`absolute top-0 right-0 bottom-0 w-[270px] sm:w-[400px] transition-transform duration-300 bg-[#fdfdfd] ${
									openFilter ? "translate-x-0" : "translate-x-full"
								} `}
							>
								<motion.div
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.5 }}
									className="relative"
								>
									<button
										className="absolute -top-4 right-6 lg:hidden"
										onClick={() => setOpenFilter(!openFilter)}
									>
										<X className="size-5" />
									</button>
									<div className="mt-8">
										{Object.keys(filterOptions).map((keyItem) => (
											<div className="p-4 ml-2 border-b" key={keyItem}>
												<h3 className="mb-3 font-bold capitalize">
													{keyItem.replace(/([a-z])([A-Z])/g, "$1 $2")}
												</h3>
												<div className="grid gap-2 mt-2">
													{filterOptions[keyItem].map((option) => (
														<Label
															className="flex items-center gap-3 font-medium"
															key={option.id}
														>
															<Checkbox
																checked={
																	filters &&
																	Object.keys(filters).length > 0 &&
																	filters[keyItem] &&
																	filters[keyItem].indexOf(option.id) > -1
																}
																onCheckedChange={() =>
																	handleFilterOnChange(keyItem, option?.id)
																}
															/>
															{option.label}
														</Label>
													))}
												</div>
											</div>
										))}
									</div>
								</motion.div>
							</motion.div>
						)}

						<motion.ul
							key={currentCoursesList?.length || 0}
							variants={containerVariants}
							initial="hidden"
							whileInView="show"
							viewport={{ once: false, amount: 0.3 }}
						>
							{currentCoursesList && currentCoursesList.length > 0 ? (
								currentCoursesList.map((courseItem) => (
									<motion.li variants={itemYVariants} key={courseItem?._id}>
										<Card
											onClick={() => handleCourseNavigate(courseItem?._id)}
											className="mb-4 cursor-pointer max-sm:mb-6 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] transition-transform duration-300"
										>
											<CardContent className="flex gap-4 p-4 max-sm:flex-col">
												<div className="w-48 h-auto max-sm:w-full shrink-0">
													<img
														src={courseItem?.image?.imageUrl}
														alt="Course banner"
														className="object-cover w-full h-full"
														loading="lazy"
													/>
												</div>
												<div className="flex-1">
													<CardTitle className="mb-2 text-lg">
														{courseItem?.title}
													</CardTitle>
													<p className="mb-1 text-sm text-gray-600">
														Created By{" "}
														<span className="font-bold">
															{courseItem?.instructorName}
														</span>
													</p>
													<p className="mt-3 mb-2 text-base text-gray-600">
														{`${courseItem?.curriculum?.length} ${
															courseItem?.curriculum?.length <= 1
																? "Lecture"
																: "Lectures"
														} - ${courseItem?.level.toUpperCase()} Level`}
													</p>
													<p className="text-lg font-bold">
														${courseItem?.pricing}
													</p>
												</div>
											</CardContent>
										</Card>
									</motion.li>
								))
							) : (
								<motion.h1
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									transition={{ duration: 0.8, delay: 0.4 }}
									className="text-3xl font-bold"
								>
									No Courses yet
								</motion.h1>
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
					</section>
				</div>
			)}
		</motion.main>
	);
}

export default StudentViewCoursesPage;
