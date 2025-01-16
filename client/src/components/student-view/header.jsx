import { useContext } from "react";
import { GraduationCap, LogOut, Menu, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
	const { resetCredentials } = useContext(AuthContext);

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.removeItem("accessToken");
	};

	return (
		<div className="container mx-auto">
			<header className="relative flex items-center justify-between p-4 border-b font-inter ">
				<div className="flex items-center space-x-4">
					<Link
						to={"/home"}
						className="flex items-center justify-center text-[#008080] hover:text-[#007070]"
					>
						<GraduationCap className="w-8 h-8 mr-3" />
						<span className="font-extrabold text-sm sm:text-base tracking-[0.02em]">
							SkillBridge
						</span>
					</Link>
					<div className="flex items-center space-x-1 max-sm:hidden">
						<Button
							variant="ghost"
							onClick={() => {
								location.pathname.includes("/courses")
									? null
									: navigate("/courses");
							}}
							className="text-sm font-medium md:text-base bg-gray-50/40"
						>
							Explore Courses
						</Button>
					</div>
				</div>

				<div className="flex items-center max-sm:hidden">
					<div className="flex items-center gap-2.5 md:gap-4">
						<Button
							variant="ghost"
							onClick={() => navigate("/student/course/list")}
							className="flex items-center gap-3 cursor-pointer"
						>
							<span className="font-extrabold text-sm md:text-base tracking-[0.02em]">
								My Courses
							</span>
							<TvMinimalPlay className="size-8" />
						</Button>
						<Button
							onClick={handleLogout}
							variant="secondary"
							className="flex items-center gap-3 cursor-pointer"
						>
							<LogOut className="size-8" />
							<span className="text-sm font-medium md:text-base">Sign Out</span>
						</Button>
					</div>
				</div>

				<NavigationMenu rightZero={true} className="sm:hidden">
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger
								hideChevronDown={true}
								className="p-0 px-2"
							>
								<Menu />
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<NavigationMenuLink>
									<Button
										variant="ghost"
										onClick={() => {
											location.pathname.includes("/courses")
												? null
												: navigate("/courses");
										}}
										className="w-full text-base font-medium rounded-none"
									>
										Explore Courses
									</Button>
								</NavigationMenuLink>
								<NavigationMenuLink>
									<Button
										variant="ghost"
										onClick={() => navigate("/student/course/list")}
										className="flex items-center w-full gap-3 my-1 rounded-none"
									>
										<span className="text-base font-medium">My Courses</span>
										<TvMinimalPlay className="cursor-pointer size-6" />
									</Button>
								</NavigationMenuLink>
								<NavigationMenuLink>
									<Button
										variant="ghost"
										onClick={handleLogout}
										className="flex items-center w-full gap-3 rounded-none"
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
