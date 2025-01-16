import { ArrowRight, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function StudentViewFooter() {
	const navigate = useNavigate();

	return (
		<div className="container mx-auto">
			<footer className="pt-10">
				<div className="bg-[#107e7d] px-4 py-8 sm:px-6 lg:px-8">
					<div className="max-w-screen-lg mx-auto flex flex-col items-center gap-4 p-6 bg-[#009090] rounded-lg shadow-lg sm:flex-row sm:justify-between">
						<strong className="text-xl text-white max-sm:text-center">
							Make Your Next Career Move!
						</strong>

						<button
							className="inline-flex items-center gap-2 px-8 py-3 text-black bg-white border border-white rounded-full hover:bg-transparent hover:text-white focus:outline-none focus:ring"
							onClick={() => {
								location.pathname.includes("/courses")
									? null
									: navigate("/courses");
							}}
						>
							<span className="text-sm font-medium">
								Let&apos;s Get Started
							</span>

							<ArrowRight />
						</button>
					</div>
					<div className="mt-20 border-t border-gray-100 sm:flex sm:items-center sm:justify-between">
						<div className="pt-5">
							<Link
								to={"/"}
								className="flex items-center justify-center text-white"
							>
								<GraduationCap className="w-8 h-8 mr-3" />
								<span className="font-extrabold text-sm sm:text-base tracking-[0.02em]">
									SkillBridge
								</span>
							</Link>
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
