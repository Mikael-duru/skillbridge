import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context/auth-context";
import { StudentContext } from "@/context/student-context/student-context";
import {
	getCourseProgress,
	markLectureAsViewed,
	resetCourseProgress,
} from "@/lib/actions";

import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
	const navigate = useNavigate();
	const { auth } = useContext(AuthContext);
	const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
		useContext(StudentContext);
	const [lockCourse, setLockCourse] = useState(false);
	const [currentLecture, setCurrentLecture] = useState(null);
	const [showCourseCompletedDialog, setShowCourseCompletedDialog] =
		useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [isSideBarOpen, setIsSideBarOpen] = useState(false);
	const [paused, setPaused] = useState(false);

	const { id } = useParams();

	const fetchCurrentCourseProgress = async () => {
		const result = await getCourseProgress(auth?.user?._id, id);

		if (result?.success) {
			if (!result?.data?.isPurchased) {
				setLockCourse(true);
			} else {
				setStudentCurrentCourseProgress({
					courseDetails: result?.data?.courseDetails,
					progress: result?.data?.progress,
				});

				if (result?.data?.completed) {
					setCurrentLecture(result?.data?.courseDetails?.curriculum[0]);
					setPaused(true); // Pause the video
					setShowCourseCompletedDialog(true);
					setShowConfetti(true);

					return;
				}

				if (result?.data?.progress?.length === 0) {
					setCurrentLecture(result?.data?.courseDetails?.curriculum[0]);
				} else {
					const lastindexofViewedAsTrue = result?.data?.progress.reduceRight(
						(acc, obj, index) => {
							return acc === -1 && obj.viewed ? index : acc;
						},
						-1
					);

					setCurrentLecture(
						result?.data?.courseDetails?.curriculum[lastindexofViewedAsTrue + 1]
					);
				}
			}
		}
	};

	const updateCourseProgress = async () => {
		if (currentLecture) {
			const result = await markLectureAsViewed(
				auth?.user?._id,
				studentCurrentCourseProgress?.courseDetails?._id,
				currentLecture?._id
			);

			if (result.success) {
				fetchCurrentCourseProgress();
			}
		}
	};

	const handleRewatchCourse = async () => {
		const result = await resetCourseProgress(
			auth?.user?._id,
			studentCurrentCourseProgress?.courseDetails?._id
		);

		if (result.success) {
			setCurrentLecture(null);
			setShowConfetti(false);
			setPaused(false);
			setShowCourseCompletedDialog(false);
			fetchCurrentCourseProgress();
		}
	};

	useEffect(() => {
		fetchCurrentCourseProgress();
	}, [id]);

	useEffect(() => {
		if (currentLecture?.progressValue === 1) {
			updateCourseProgress();
		}
	}, [currentLecture]);

	useEffect(() => {
		if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
	}, [showConfetti]);

	// console.log("currentLecture:", currentLecture);
	// console.log("studentCurrentCourseProgress:", studentCurrentCourseProgress);

	return (
		<div className="container relative mx-auto overflow-x-hidden">
			<main className="flex flex-col bg-[#1C1D1F] text-white font-inter">
				{showConfetti && <Confetti />}
				<div className="flex items-center justify-between p-4 bg-[#1C1D1F] border-b border-gray-700">
					<div className="flex items-center space-x-4">
						<Button
							className="text-white bg-[#333] hover:bg-[#008080] flex items-center"
							size="sm"
							onClick={() => navigate(-1)}
						>
							<ChevronLeft className="size-4" /> Back to Previous Page
						</Button>
						<h1 className="hidden text-lg font-bold md:block">
							{studentCurrentCourseProgress?.courseDetails?.title}
						</h1>
					</div>
					<Button
						onClick={() => setIsSideBarOpen(!isSideBarOpen)}
						className="bg-[#333] hover:bg-[#008080]"
					>
						{isSideBarOpen ? (
							<ChevronRight className="size-5" />
						) : (
							<ChevronLeft className="size-5" />
						)}
					</Button>
				</div>

				<div className="flex flex-1 overflow-hidden">
					<div
						className={`flex-1 ${
							isSideBarOpen ? "mr-[400px]" : ""
						} transition-all duration-300`}
					>
						<VideoPlayer
							width="100%"
							height="500px"
							url={currentLecture?.videoUrl}
							onProgressUpdate={setCurrentLecture}
							progressData={currentLecture}
							paused={paused} // Pass the paused state
						/>
						<div className="p-6 bg-[#1c1d1f]">
							<h2 className="mb-2 text-2xl font-bold">
								{currentLecture?.title}
							</h2>
						</div>
					</div>
					<div
						className={`absolute top-[68.5px] right-0 bottom-0 w-full sm:w-[400px] border-l border-gray-700 transition-all duration-300 bg-[#1c1d1f] ${
							isSideBarOpen ? "translate-x-0" : "translate-x-full"
						}`}
					>
						<Tabs defaultValue="content" className="flex flex-col h-full">
							<TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
								<TabsTrigger
									value="content"
									className="h-full text-black bg-white border-r rounded-none hover:bg-gray-100"
								>
									Course Content
								</TabsTrigger>
								<TabsTrigger
									value="overview"
									className="h-full text-black bg-white rounded-none hover:bg-gray-100"
								>
									Overview
								</TabsTrigger>
							</TabsList>
							<TabsContent value="content">
								<ScrollArea className="h-full">
									<div className="p-4 space-y-4">
										{studentCurrentCourseProgress?.courseDetails?.curriculum.map(
											(item) => (
												<div
													className={`flex items-center space-x-2 text-sm font-semibold ${
														item?._id === currentLecture?._id
															? "text-[#35acac] font-bold"
															: "text-[#fdfdfd]"
													}`}
													key={item?._id}
												>
													{studentCurrentCourseProgress?.progress?.find(
														(progressItem) =>
															progressItem?.lectureId === item?._id
													) ? (
														<Check className="text-green-500 size-4" />
													) : (
														<Play className="size-4" />
													)}
													<span className="">{item?.title}</span>
												</div>
											)
										)}
									</div>
								</ScrollArea>
							</TabsContent>
							<TabsContent value="overview" className="flex-1 overflow-hidden ">
								<ScrollArea className="h-full">
									<div className="p-4">
										<h2 className="mb-4 text-xl font-bold">
											About this Course
										</h2>
										<p className="text-gray-400">
											{studentCurrentCourseProgress?.courseDetails?.description}
										</p>
									</div>
								</ScrollArea>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				{/* Show buy course option for not-students */}
				<Dialog open={lockCourse}>
					<DialogContent className="sm:w-[425px]">
						<DialogHeader>
							<DialogTitle className="text-center">
								You can&apos;t view this page
							</DialogTitle>
							<DialogDescription className="text-center">
								Please purchase this course to get access
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>

				{/* Show completed course options */}
				<Dialog open={showCourseCompletedDialog}>
					<DialogContent showOverlay={true} className="sm:w-[425px]">
						<DialogHeader>
							<DialogTitle className="mb-[2px] text-center">
								Congratulations!
							</DialogTitle>
							<DialogDescription className="flex flex-col gap-4 text-center">
								<Label>You have completed this course</Label>
								<span className="flex items-center justify-center gap-3">
									<Button
										variant="secondary"
										onClick={() => navigate("/student/course/list")}
									>
										My Courses Page
									</Button>
									<Button variant="secondary" onClick={handleRewatchCourse}>
										Rewatch Course
									</Button>
								</span>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</main>
		</div>
	);
}

export default StudentViewCourseProgressPage;
