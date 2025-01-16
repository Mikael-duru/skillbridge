import { useContext } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { instructorContext } from "@/context/instructor-context/instructor-context";
import { mediaDelete, mediaUpload } from "@/lib/actions";
import MediaProgressBar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";

function CourseBanner() {
	const {
		courseLandingFormData,
		setCourseLandingFormData,
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(instructorContext);

	const handleImageUploadChange = async (e) => {
		const selectedImage = e.target.files[0];

		if (selectedImage) {
			const imageFormData = new FormData();
			imageFormData.append("file", selectedImage);

			try {
				setMediaUploadProgress(true);

				const response = await mediaUpload(
					imageFormData,
					setMediaUploadProgressPercentage
				);

				if (response.success) {
					setCourseLandingFormData({
						...courseLandingFormData,
						image: {
							imageUrl: response?.data?.url,
							public_id: response?.data?.public_id,
						},
					});
				}
			} catch (error) {
				console.error("Error during image upload:", error);
			} finally {
				setMediaUploadProgress(false);
			}
		}
	};

	const handleReplaceVideo = async (id) => {
		const getCurrentImagePublicId = id;

		const deleteCurrentMediaResponse = await mediaDelete(
			getCurrentImagePublicId
		);

		if (deleteCurrentMediaResponse.success) {
			setCourseLandingFormData({
				...courseLandingFormData,
				image: {
					imageUrl: "",
					public_id: "",
				},
			});
		}
	};

	return (
		<section className="font-inter">
			<Card>
				<CardHeader className="max-sm:px-3">
					<CardTitle>Course Banner</CardTitle>
				</CardHeader>
				<CardContent className="max-sm:px-3">
					{mediaUploadProgress ? (
						<MediaProgressBar
							isMediaUploading={mediaUploadProgress}
							progress={mediaUploadProgressPercentage}
						/>
					) : null}
					{courseLandingFormData?.image?.imageUrl ? (
						<div className="flex gap-4 max-sm:flex-col">
							<div className="max-w-7xl">
								<img
									src={courseLandingFormData?.image?.imageUrl}
									alt="course banner"
									className="w-full"
								/>
							</div>
							<Button
								variant="secondary"
								onClick={() =>
									handleReplaceVideo(courseLandingFormData?.image?.public_id)
								}
							>
								Replace Image
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							<Label>Upload Course Image</Label>
							<Input
								type="file"
								accept="image"
								onChange={handleImageUploadChange}
								className="pt-2 mb-4 cursor-pointer hover:border-[#008080]"
							/>
						</div>
					)}
				</CardContent>
			</Card>
		</section>
	);
}

export default CourseBanner;
