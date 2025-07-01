import { motion } from "framer-motion";

function LoadingCircleSpinner() {
	return (
		<div className="min-h-[50vh] w-full flex items-center justify-center">
			<motion.div
				className="spinner"
				animate={{ rotate: 360 }}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: "linear",
				}}
			/>
		</div>
	);
}

export default LoadingCircleSpinner;
