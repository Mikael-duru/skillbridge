import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MediaProgressBar({ isMediaUploading, progress }) {
	const [showProgress, setShowProgress] = useState(false);
	const [animatedProgress, setAnimatedProgress] = useState(0);

	useEffect(() => {
		if (isMediaUploading) {
			setShowProgress(true);
			setAnimatedProgress(progress);
		} else {
			const timer = setTimeout(() => {
				setShowProgress(false);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isMediaUploading, progress]);

	if (!showProgress) return null;

	return (
		<div className="relative w-full h-3 my-5 overflow-hidden bg-gray-200 rounded-full">
			<motion.div
				className="bg-[#008080] rounded-full h-3"
				initial={{ width: 0 }}
				animate={{
					width: `${animatedProgress}%`,
					transition: { duration: 0.5, ease: "easeInOut" },
				}}
			>
				{progress >= 100 && isMediaUploading && (
					<motion.div
						className="absolute inset-0 bg-[#004040] opacity-50"
						animate={{
							x: ["0%", "100%", "0%"],
						}}
						transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					/>
				)}
			</motion.div>
		</div>
	);
}

export default MediaProgressBar;
