import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/video-player";
import { StudentContext } from "@/context/student-context/student-context";
import {
	checkCoursePurchaseInfo,
	convertUsdToNgn,
	createPayment,
	getStudentCourseDetailsById,
} from "@/lib/actions";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context/auth-context";

import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PaystackButton } from "react-paystack";
import { motion } from "framer-motion";
import {
	containerVariants,
	itemVariants2,
	itemYVariants,
	listVariants,
} from "@/lib/utils";
import LoadingCircleSpinner from "@/components/ui/loader";

function CourseDetailsPage() {
	const {
		studentViewCourseDetails,
		setStudentViewCourseDetails,
		currentCourseDetailsId,
		setCurrentCourseDetailsId,
		loading,
		setLoading,
	} = useContext(StudentContext);

	const { auth } = useContext(AuthContext);

	const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
	const [amountInNgn, setAmountInNgn] = useState(null);
	const [approvalUrl, setApprovalUrl] = useState("");
	const [displayFreePreviewVideo, setDisplayFreePreviewVideo] = useState(null);
	const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
	const [selectedFreePreviewLectureId, setSelectedFreePreviewLectureId] =
		useState(null);
	const [openPaymentOptions, setOpenPaymentOptions] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();

	useEffect(() => {
		if (id) setCurrentCourseDetailsId(id);
	}, [id]);

	const getStudentViewCourseDetails = async () => {
		const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfo(
			currentCourseDetailsId,
			auth?.user?._id
		);

		if (
			checkCoursePurchaseInfoResponse?.success &&
			checkCoursePurchaseInfoResponse?.data
		) {
			navigate(`/student/course-progress/${currentCourseDetailsId}`);
			return;
		}

		const result = await getStudentCourseDetailsById(currentCourseDetailsId);

		if (result?.success) {
			setStudentViewCourseDetails(result?.data);
			setLoading(false);
		} else {
			setStudentViewCourseDetails(null);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (currentCourseDetailsId !== null) getStudentViewCourseDetails();
	}, [currentCourseDetailsId]);

	useEffect(() => {
		if (!location.pathname.includes("course/details")) {
			setCurrentCourseDetailsId(null), setStudentViewCourseDetails(null);
		}
	}, [location.pathname]);

	const handleSetFreePreview = (currentVideoInfo) => {
		setDisplayFreePreviewVideo(currentVideoInfo?.videoUrl);
	};

	// Handle lecture click
	const handleLectureClick = (curriculumItem) => {
		setSelectedFreePreviewLectureId(curriculumItem?._id);
		handleSetFreePreview(curriculumItem);
	};

	const paymentPayload = {
		studentId: auth?.user?._id,
		userName: auth?.user?.fullName,
		userEmail: auth?.user?.email,
		orderStatus: "pending",
		paymentStatus: "initiated",
		orderDate: new Date(),
		paymentId: "",
		payerId: "",
		instructorId: studentViewCourseDetails?.instructorId,
		instructorName: studentViewCourseDetails?.instructorName,
		courseImage: studentViewCourseDetails?.image?.imageUrl,
		courseTitle: studentViewCourseDetails?.title,
		courseId: studentViewCourseDetails?._id,
		coursePricing: studentViewCourseDetails?.pricing,
	};

	//Paypal payment function
	const handlePayWithPaypal = async () => {
		const result = await createPayment(paymentPayload);

		if (result.success) {
			sessionStorage.setItem(
				"currentOrderId",
				JSON.stringify(result?.data?.orderId)
			);
			setApprovalUrl(result?.data?.approvalUrl);
		}
	};

	// Currency conversion (dollars to naira)
	useEffect(() => {
		const getAmountInNaira = async () => {
			if (studentViewCourseDetails?.pricing) {
				const amountInNaira = await convertUsdToNgn(
					studentViewCourseDetails.pricing
				);
				setAmountInNgn(amountInNaira);
			}
		};

		getAmountInNaira();
	}, [studentViewCourseDetails?.pricing]);

	// Paystack payment function
	const componentProps = {
		email: auth?.user?.email,
		amount: amountInNgn * 100,
		publicKey,
		metadata: {
			paymentPayload,
		},
		text: "Pay with Paystack",
		onSuccess: () => {
			toast.success("Order processed successfully!");
			window.location.href = "/student/course/list";
		},
		onClose: () => {
			toast.error("Transaction canceled");
		},
	};

	useEffect(() => {
		if (displayFreePreviewVideo !== null) setShowFreePreviewDialog(true);
	}, [displayFreePreviewVideo]);

	if (approvalUrl !== "") {
		window.location.href = approvalUrl;
	}

	const getIndexOfFreePreviewUrl =
		studentViewCourseDetails !== null
			? studentViewCourseDetails?.curriculum?.findIndex(
					(item) => item.freePreview
			  )
			: -1;

	if (loading) <LoadingCircleSpinner />;

	return (
		<motion.main
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 1 }}
			className="container p-4 mx-auto font-inter"
		>
			<section className="p-5 text-white bg-gray-900 rounded-t-lg sm:p-8">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mb-2 sm:mb-4 text-[20px] font-bold sm:text-3xl"
				>
					{studentViewCourseDetails?.title}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="mb-4 sm:text-xl"
				>
					{studentViewCourseDetails?.subtitle}
				</motion.p>
				<div className="flex flex-wrap items-center mt-4 text-xs sm:text-sm gap-y-3 gap-x-5 sm:gap-5">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="shrink-0"
					>
						Created By {studentViewCourseDetails?.instructorName}
					</motion.span>
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						Created On {studentViewCourseDetails?.date.split("T")[0]}
					</motion.span>
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="flex items-center capitalize"
					>
						<Globe className="mr-1 size-4" />
						{studentViewCourseDetails?.primaryLanguage}
					</motion.span>
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						{studentViewCourseDetails?.students.length}{" "}
						{studentViewCourseDetails?.students.length <= 1
							? "Student"
							: "Students"}
					</motion.span>
				</div>
			</section>
			<section className="flex gap-2 mt-4 lg:gap-8 max-lg:flex-col">
				<div className="flex-grow">
					{/* Objectives */}
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>What you will learn:</CardTitle>
						</CardHeader>
						<CardContent>
							<motion.ul
								key={studentViewCourseDetails?.objectives || 0}
								variants={containerVariants}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true, amount: 0.3 }}
								className="grid grid-cols-1 gap-2 md:grid-cols-2"
							>
								{studentViewCourseDetails?.objectives
									.split(",")
									.map((objective, index) => (
										<motion.li
											variants={itemYVariants}
											key={index}
											className="flex items-center justify-start"
										>
											<CheckCircle className="flex-shrink-0 mr-2 text-green-500 size-4 sm:size-5" />
											<span className="text-sm sm:text-base">{objective}</span>
										</motion.li>
									))}
							</motion.ul>
						</CardContent>
					</Card>
					{/* Description */}
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>Course Description</CardTitle>
						</CardHeader>
						<CardContent>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.7 }}
								className="text-sm sm:text-base"
							>
								{studentViewCourseDetails?.description}
							</motion.p>
						</CardContent>
					</Card>
					{/* Curriculum */}
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>Course Curriculum</CardTitle>
						</CardHeader>
						<CardContent>
							<motion.ul
								key={studentViewCourseDetails?.curriculum?.length || 0}
								variants={listVariants}
								initial="hidden"
								animate="visible"
							>
								{studentViewCourseDetails?.curriculum?.map(
									(curriculumItem, index) => (
										<motion.li
											key={index}
											variants={itemVariants2}
											transition={{ duration: 0.8, delay: index * 0.1 }}
											className={`${
												curriculumItem?.freePreview
													? "cursor-pointer"
													: "cursor-not-allowed"
											} flex items-center mb-4 ${
												curriculumItem?._id === selectedFreePreviewLectureId
													? "text-[#008080]"
													: ""
											}`}
											onClick={
												curriculumItem?.freePreview
													? () => handleLectureClick(curriculumItem)
													: null
											}
										>
											{curriculumItem?.freePreview ? (
												<PlayCircle className="mr-2 size-4" />
											) : (
												<Lock className="mr-2 size-4" />
											)}
											<span className="text-base sm:text-sm">
												{curriculumItem?.title}
											</span>
										</motion.li>
									)
								)}
							</motion.ul>
						</CardContent>
					</Card>
				</div>
				<motion.aside
					initial={{ x: 30, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.7 }}
					className="w-full md:w-[500px] pb-10"
				>
					<Card className="sticky top-4">
						<CardContent className="p-2 sm:p-6">
							<div className="flex items-center justify-center mb-4 rounded-lg aspect-video">
								<VideoPlayer
									url={
										getIndexOfFreePreviewUrl !== -1
											? studentViewCourseDetails?.curriculum[
													getIndexOfFreePreviewUrl
											  ].videoUrl
											: ""
									}
									width="450px"
									height="235px"
								/>
							</div>
							<div className="mb-4">
								<span className="text-3xl font-bold">
									${studentViewCourseDetails?.pricing}
								</span>
							</div>
							<div
								className={`border border-[#008080]/10 rounded-md overflow-hidden transition-all duration-500 ease-linear`}
							>
								<Button
									variant="secondary"
									className="w-full rounded-b-none"
									onClick={() => setOpenPaymentOptions((prev) => !prev)}
								>
									Buy Now
								</Button>

								<div
									className={`grid transition-all duration-500 ease-linear ${
										openPaymentOptions ? "max-h-[500px] p-3" : "max-h-0 p-0"
									} bg-[#fdfdfd]`}
								>
									<Button
										variant="outline"
										className="w-full mb-2 text-[#006060] hover:text-[#006060] font-bold shadow-sm"
										onClick={handlePayWithPaypal}
									>
										Pay with PayPal
									</Button>
									<Button
										variant="outline"
										className="w-full text-[#006060] shadow-sm font-bold hover:text-[#006060]"
										asChild
									>
										<PaystackButton {...componentProps} />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.aside>
			</section>
			<Dialog
				open={showFreePreviewDialog}
				onOpenChange={() => {
					setShowFreePreviewDialog(false);
					setDisplayFreePreviewVideo(null);
				}}
			>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Course Preview</DialogTitle>
					</DialogHeader>
					<div className="flex items-center justify-center rounded-lg aspect-video">
						<VideoPlayer
							url={displayFreePreviewVideo}
							width="450px"
							height="235px"
						/>
					</div>
					<div className="flex flex-col gap-2">
						{studentViewCourseDetails?.curriculum
							?.filter((item) => item.freePreview)
							.map((filteredItem) => (
								<p
									onClick={() => handleLectureClick(filteredItem)}
									className={`text-base font-medium cursor-pointer ${
										filteredItem?._id === selectedFreePreviewLectureId
											? "text-[#008080]"
											: ""
									}`}
									key={filteredItem?._id}
								>
									{filteredItem?.title}
								</p>
							))}
					</div>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</motion.main>
	);
}

export default CourseDetailsPage;
