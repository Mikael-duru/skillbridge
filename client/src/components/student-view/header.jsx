import { useContext } from "react";
import { GraduationCap, LogOut, Menu, TvMinimalPlay } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context/auth-context";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../ui/navigation-menu";

function StudentViewHeader() {
	const navigate = useNavigate();
	const location = useLocation();
	const isCourses = location.pathname.includes("/courses");
	const isMyCourses = location.pathname.includes("/student/course/list");

	const { resetCredentials } = useContext(AuthContext);

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.removeItem("accessToken");
	};

	return (
		<div className="container mx-auto">
			<header className="relative flex items-center justify-between p-4 border-b font-inter ">
				<div className="flex items-center space-x-4">
					<a
						href={"/"}
						className="flex items-center justify-center text-[#008080] hover:text-[#007070] active:scale-95"
					>
						<GraduationCap className="w-8 h-8 mr-3" />
						<span className="font-extrabold text-sm sm:text-base tracking-[0.02em]">
							SkillBridge
						</span>
					</a>
					<div className="flex items-center space-x-1 max-sm:hidden">
						<Button
							variant="ghost"
							onClick={() => {
								navigate("/courses");
							}}
							className={`text-sm font-medium transition-transform duration-300 md:text-base bg-gray-50 ${
								isCourses
									? "text-[#008080] hover:text-[#008080] hover:bg-initial border-[#008080]/50 border"
									: "hover:scale-105 active:scale-95"
							}`}
						>
							Explore Courses
						</Button>
					</div>
				</div>

				<div className="flex items-center max-md:hidden">
					<div className="flex items-center gap-2.5 md:gap-4">
						<Button
							variant="outline"
							onClick={() => navigate("/student/course/list")}
							className={`flex items-center gap-3 transition-transform duration-300 cursor-pointer ${
								isMyCourses
									? "text-[#008080] hover:text-[#008080] border-[#008080]/50 hover:bg-initial"
									: "hover:scale-105 active:scale-95"
							}`}
						>
							<span className="font-extrabold text-sm md:text-base tracking-[0.02em]">
								My Courses
							</span>
							<TvMinimalPlay className="size-8" />
						</Button>
						<Button
							onClick={handleLogout}
							variant="destructive"
							className="flex items-center gap-3 cursor-pointer"
						>
							<LogOut className="size-8" />
							<span className="text-sm font-medium md:text-base">Sign Out</span>
						</Button>
					</div>
				</div>

				<NavigationMenu rightZero={true} className="md:hidden">
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger
								hideChevronDown={true}
								className="p-0 px-2"
							>
								<Menu />
							</NavigationMenuTrigger>
							<NavigationMenuContent className="p-4">
								<NavigationMenuLink>
									<Button
										variant="ghost"
										onClick={() => {
											navigate("/courses");
										}}
										className={`w-full mb-2 text-base font-medium sm:hidden bg-gray-50 ${
											isCourses
												? "text-[#008080] hover:text-[#008080] hover:bg-initial border-[#008080]/50 border"
												: "active:scale-95"
										}`}
									>
										Explore Courses
									</Button>
								</NavigationMenuLink>
								<NavigationMenuLink>
									<Button
										variant="ghost"
										onClick={() => navigate("/student/course/list")}
										className={`flex items-center justify-start w-full gap-3 mb-3 bg-gray-50 ${
											isMyCourses
												? "text-[#008080] hover:text-[#008080] border-[#008080]/50 hover:bg-initial"
												: "active:scale-95"
										}`}
									>
										<span className="text-base font-medium">My Courses</span>
										<TvMinimalPlay className="cursor-pointer size-6" />
									</Button>
								</NavigationMenuLink>
								<NavigationMenuLink>
									<Button
										variant="destructive"
										onClick={handleLogout}
										className="flex items-center justify-start w-full gap-3"
									>
										<LogOut />
										<span className="text-base font-medium">Sign Out</span>
									</Button>
								</NavigationMenuLink>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</header>
		</div>
	);
}

export default StudentViewHeader;
