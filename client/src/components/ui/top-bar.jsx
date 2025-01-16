import {
	Book,
	GraduationCap,
	LayoutDashboard,
	LogOut,
	Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "./button";
import InstructorDashboard from "../instructor-view/dashboard";
import InstructorCourses from "../instructor-view/courses";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../ui/navigation-menu";

function TopBar({ sortedCourses, activeTab, setActiveTab, handleLogout }) {
	const menuItems = [
		{
			label: "Dashboard",
			value: "dashboard",
			icon: LayoutDashboard,
			component: <InstructorDashboard listOfCourses={sortedCourses} />,
		},
		{
			label: "Courses",
			value: "courses",
			icon: Book,
			component: <InstructorCourses listOfCourses={sortedCourses} />,
		},
	];

	return (
		<header className="flex items-center justify-between h-[73px] sm:gap-16 px-[5%] border-b lg:px-6 shrink-0 font-inter bg-white">
			<Link
				to={"/"}
				className="flex items-center justify-center text-[#008080] hover:text-[#007070] text-lg"
			>
				<GraduationCap className="w-8 h-8 mr-3" />
				<span className="font-extrabold text-sm sm:text-base tracking-[0.02em]">
					SkillBridge
				</span>
			</Link>
			<div className="flex items-center justify-between flex-1 max-sm:hidden">
				<nav className="flex gap-5">
					{menuItems.map((menuItem) => (
						<button
							key={menuItem.value}
							className={`justify-start w-full tracking-[0.02em] p-1 font-inter ${
								activeTab === menuItem.value ? "text-[#076070]" : "text-black"
							}`}
							onClick={() => setActiveTab(menuItem.value)}
						>
							{menuItem.label}
						</button>
					))}
				</nav>
				<Button
					onClick={handleLogout}
					variant="secondary"
					className="flex items-center gap-3 cursor-pointer"
				>
					<LogOut className="size-8" />
					<span className="text-sm font-medium md:text-base">Sign Out</span>
				</Button>
			</div>
			<NavigationMenu rightZero={true} className="sm:hidden">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger hideChevronDown={true} className="p-0 px-2">
							<Menu />
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							{menuItems.map((menuItem) => (
								<NavigationMenuLink key={menuItem.value}>
									<Button
										className={`justify-start w-full tracking-[0.02em] text-base rounded-none mt-1 ${
											activeTab === menuItem.value
												? "text-[#076070]"
												: "text-black"
										}`}
										variant="ghost"
										onClick={() => setActiveTab(menuItem.value)}
									>
										<menuItem.icon className="mr-2 size-4" /> {menuItem.label}
									</Button>
								</NavigationMenuLink>
							))}
							<NavigationMenuLink>
								<Button
									onClick={handleLogout}
									variant="ghost"
									className="justify-start w-full my-1 text-base text-red-500 rounded-none cursor-pointer hover:text-red-500"
								>
									<LogOut className="mr-2 size-4" />
									Sign Out
								</Button>
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
}

export default TopBar;
