import { useContext, useRef } from "react";

import MediaProgressBar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { CourseCurriculumInitialFormData } from "@/config";
import { instructorContext } from "@/context/instructor-context/instructor-context";
import { mediaBulkUpload, mediaDelete, mediaUpload } from "@/lib/actions";
import { Upload } from "lucide-react";

function CourseCurriculum() {
	const {
		courseCurriculumFormData,
		setCourseCurriculumFormData,
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(instructorContext);

	const bulkUploadInputRef = useRef(null);

	const handleNewLecture = () => {
		setCourseCurriculumFormData([
			...courseCurriculumFormData,
			{
				...CourseCurriculumInitialFormData[0],
			},
		]);
	};

	const handleCourseTitleChange = (e, currentIndex) => {
		const copyCourseCurriculumFormData = [...courseCurriculumFormData];

		copyCourseCurriculumFormData[currentIndex] = {
			...copyCourseCurriculumFormData[currentIndex],
			title: e.target.value,
		};

		setCourseCurriculumFormData(copyCourseCurriculumFormData);
	};

	const handleFreePreviewChange = (currentValue, currentIndex) => {
		const copyCourseCurriculumFormData = [...courseCurriculumFormData];

		copyCourseCurriculumFormData[currentIndex] = {
			...copyCourseCurriculumFormData[currentIndex],
			freePreview: currentValue,
		};

		setCourseCurriculumFormData(copyCourseCurriculumFormData);
	};

	const handleSingleLectureUpload = async (e, currentIndex) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			const videoFormData = new FormData();
			videoFormData.append("file", selectedFile);

			try {
				setMediaUploadProgress(true);

				const response = await mediaUpload(
					videoFormData,
					setMediaUploadProgressPercentage
				);
				if (response.success) {
					const copyCourseCurriculumFormData = [...courseCurriculumFormData];

					copyCourseCurriculumFormData[currentIndex] = {
						...copyCourseCurriculumFormData[currentIndex],
						videoUrl: response?.data?.url,
						public_id: response?.data?.public_id,
					};

					setCourseCurriculumFormData(copyCourseCurriculumFormData);
				}
			} catch (error) {
				console.error("Error during single media upload:", error);
			} finally {
				setMediaUploadProgress(false);
			}
		}
	};

	const handleReplaceVideo = async (currentIndex) => {
		const copyCourseCurriculumFormData = [...courseCurriculumFormData];

		const getCurrentVideoPublicId =
			copyCourseCurriculumFormData[currentIndex]?.public_id;

		const deleteCurrentMediaResponse = await mediaDelete(
			getCurrentVideoPublicId
		);

		if (deleteCurrentMediaResponse.success) {
			copyCourseCurriculumFormData[currentIndex] = {
				...copyCourseCurriculumFormData[currentIndex],
				videoUrl: "",
				public_id: "",
			};

			setCourseCurriculumFormData(copyCourseCurriculumFormData);
		}
	};

	const isCourseCurriculumFormDataValid = () => {
		return courseCurriculumFormData.every((item) => {
			return (
				item &&
				typeof item === "object" &&
				item.title.trim() !== "" &&
				item.videoUrl.trim() !== ""
			);
		});
	};

	const handleOpenBulkUploadDialog = () => {
		bulkUploadInputRef.current?.click();
	};

	// Check if all the formData object is empty
	const isCourseCurriculumFormDataObjectEmpty = (arr) => {
		return arr.every((obj) => {
			// eslint-disable-next-line no-unused-vars
			return Object.entries(obj).every(([key, value]) => {
				if (typeof value === "boolean") {
					return true;
				}

				return value === "";
			});
		});
	};

	const handleMediaBulkUpload = async (e) => {
		const selectedFiles = Array.from(e.target.files);
		const bulkFormData = new FormData();

		// Append each selected file to the FormData object
		selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

		try {
			setMediaUploadProgress(true);
			const response = await mediaBulkUpload(
				bulkFormData,
				setMediaUploadProgressPercentage
			);

			console.log("BULK response:", response);

			if (response.success) {
				// Check if the course curriculum form data is empty or not
				let copyCourseCurriculumFormData =
					isCourseCurriculumFormDataObjectEmpty(courseCurriculumFormData)
						? []
						: [...courseCurriculumFormData];

				// Combine existing and new data
				copyCourseCurriculumFormData = [
					...copyCourseCurriculumFormData,
					...(response?.data || []).map((item, index) => ({
						videoUrl: item?.url,
						public_id: item?.public_id,
						title: `Lecture ${
							copyCourseCurriculumFormData.length + (index + 1)
						}`,
						freePreview: false,
					})),
				];

				setCourseCurriculumFormData(copyCourseCurriculumFormData);
			}
		} catch (error) {
			console.error("Error during bulk media upload:", error);
		} finally {
			setMediaUploadProgress(false);
		}
	};

	const handleDeleteLecture = async (currentIndex) => {
		let copyCourseCurriculumFormData = [...courseCurriculumFormData];

		const getCurrentSelectedVideopublicId =
			copyCourseCurriculumFormData[currentIndex]?.public_id;

		const response = await mediaDelete(getCurrentSelectedVideopublicId);

		if (response.success) {
			copyCourseCurriculumFormData = copyCourseCurriculumFormData.filter(
				(_, index) => index !== currentIndex
			);

			setCourseCurriculumFormData(copyCourseCurriculumFormData);
		}
	};

	return (
		<section className="font-inter">
			<Card>
				<CardHeader className="max-sm:px-3">
					<CardTitle>Course Curriculum</CardTitle>
				</CardHeader>
				<CardContent className="max-sm:px-3">
					<div>
						<Input
							type="file"
							ref={bulkUploadInputRef}
							accept="video/*"
							multiple
							className="hidden"
							id="bulk-media-upload"
							onChange={handleMediaBulkUpload}
						/>
						<Button
							as="label"
							htmlFor="bulk-media-upload"
							variant="outline"
							className="cursor-pointer"
							onClick={handleOpenBulkUploadDialog}
						>
							<Upload className="w-4 h-5 mr-2" />
							Bulk Upload
						</Button>
					</div>

					{mediaUploadProgress ? (
						<MediaProgressBar
							isMediaUploading={mediaUploadProgress}
							progress={mediaUploadProgressPercentage}
						/>
					) : null}

					<div className="my-4 space-y-4">
						{courseCurriculumFormData.map((curriculumItem, index) => (
							<div className="p-4 border rounded-md sm:p-5" key={index}>
								<div className="flex gap-5 sm:items-center max-sm:flex-col">
									<h3 className="font-semibold shrink-0">
										Lecture {index + 1}
									</h3>
									<Input
										name={`title-${index + 1}`}
										placeholder="Enter lecture title"
										className="max-w-96"
										onChange={(e) => handleCourseTitleChange(e, index)}
										value={curriculumItem?.title || ""}
									/>
									<div className="flex items-center space-x-2 shrink-0">
										<Switch
											onCheckedChange={(value) =>
												handleFreePreviewChange(value, index)
											}
											checked={courseCurriculumFormData[index]?.freePreview}
											id={`freePreview-${index + 1}`}
										/>
										<Label htmlFor={`freePreview-${index + 1}`}>
											Free Preview
										</Label>
									</div>
								</div>

								<div className="mt-6">
									{curriculumItem?.videoUrl ? (
										<div className="flex gap-3">
											<VideoPlayer
												width="450px"
												height="200px"
												url={curriculumItem?.videoUrl}
											/>
											<Button
												variant="secondary"
												onClick={() => handleReplaceVideo(index)}
											>
												Replace Video
											</Button>
											<Button
												className="bg-red-500"
												onClick={() => handleDeleteLecture(index)}
											>
												Delete Lecture
											</Button>
										</div>
									) : (
										<Input
											type="file"
											accept="video/*"
											onChange={(e) => handleSingleLectureUpload(e, index)}
											className="pt-2 mb-4 cursor-pointer hover:border-[#008080]"
										/>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Add lecture button */}
					<Button
						variant="secondary"
						onClick={handleNewLecture}
						disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
					>
						Add Lecture
					</Button>
				</CardContent>
			</Card>
		</section>
	);
}

export default CourseCurriculum;
