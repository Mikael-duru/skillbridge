import { ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";

function StudentViewFooter() {
	const location = useLocation();
	const isCourses = location.pathname.includes("/courses");

	return (
		<div className="container mx-auto">
			<footer className="pt-10">
				<div className="bg-[#107e7d] px-4 py-8 sm:px-6 lg:px-8">
					<div className="max-w-screen-lg mx-auto flex flex-col items-center gap-8 max-xs:px-6 p-10 bg-[#009090] rounded-lg shadow-lg sm:flex-row sm:justify-between">
						<motion.strong
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="text-xl text-white max-sm:text-center"
						>
							Make Your Next Career Move!
						</motion.strong>

						<motion.a
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							href="/courses"
							className={`inline-flex items-center gap-2 px-8 py-3 text-black font-semibold bg-white border border-white rounded-full hover:bg-transparent hover:text-white active:scale-105 ${
								isCourses ? "pointer-events-none" : "animate-bounce"
							}`}
						>
							<span className="text-sm xs:text-base">Start Learning Today</span>

							<ArrowRight />
						</motion.a>
					</div>

					<div className="mt-20 border-t border-gray-100 sm:flex sm:items-center sm:justify-between">
						<div className="pt-5">
							<a
								href={"/"}
								className="flex items-center justify-center text-white active:scale-95"
							>
								<GraduationCap className="w-8 h-8 mr-3" />
								<span className="font-extrabold text-sm sm:text-base tracking-[0.02em]">
									SkillBridge
								</span>
							</a>
						</div>

						<p className="mt-4 text-sm text-center text-white lg:mt-0 lg:text-right">
							Copyright &copy; 2024. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default StudentViewFooter;
