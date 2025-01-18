import { LayoutDashboard, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context/auth-context";
import Header from "@/components/ui/header";
import { instructorContext } from "@/context/instructor-context/instructor-context";
import { getAllCourses } from "@/lib/actions";
import TopBar from "@/components/ui/top-bar";

function InstructorDashboardPage() {
	const [activeTab, setActiveTab] = useState(
		() => sessionStorage.getItem("currentTab") || "dashboard"
	);
	const { resetCredentials } = useContext(AuthContext);
	const { instructorCoursesList, setInstructorCoursesList } =
		useContext(instructorContext);

	const fetchAllCourses = async () => {
		const response = await getAllCourses();
		if (response.success) setInstructorCoursesList(response?.data);
	};

	useEffect(() => {
		fetchAllCourses();
	}, []);

	useEffect(() => {
		sessionStorage.setItem("currentTab", activeTab);
	}, [activeTab]);

	useEffect(() => {
		return () => {
			sessionStorage.removeItem("currentTab");
		};
	}, []);

	// Sort courses by creation date (newest first)
	const sortedCourses =
		instructorCoursesList?.slice().sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		}) || [];

	const menuItems = [
		{
			icon: LayoutDashboard,
			label: "Dashboard",
			value: "dashboard",
			component: <InstructorDashboard listOfCourses={sortedCourses} />,
		},
		{
			icon: Book,
			label: "Courses",
			value: "courses",
			component: <InstructorCourses listOfCourses={sortedCourses} />,
		},
		{
			icon: LogOut,
			label: "Logout",
			value: "logout",
			component: null,
		},
	];

	const handleLogout = () => {
		resetCredentials();
		sessionStorage.removeItem("accessToken");
	};

	return (
		<main className="container mx-auto">
			<div className="flex h-full min-h-screen bg-gray-100 font-inter">
				<aside className="hidden bg-white shadow-md xl:w-64 xl:block">
					<div className="p-4">
						<Header />

						<nav className="mt-10">
							{menuItems.map((menuItem) => (
								<Button
									key={menuItem.value}
									className="justify-start w-full mb-4 tracking-[0.02em]"
									variant={activeTab === menuItem.value ? "secondary" : "ghost"}
									onClick={
										menuItem.value === "logout"
											? handleLogout
											: () => setActiveTab(menuItem.value)
									}
								>
									<menuItem.icon className="mr-2 size-4" />
									{menuItem.label}
								</Button>
							))}
						</nav>
					</div>
				</aside>

				<div className="flex-1">
					<div className="xl:hidden">
						<TopBar
							sortedCourses={sortedCourses}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							handleLogout={handleLogout}
						/>
					</div>

					<section className="px-[5%] py-8 lg:p-8 overflow-y-auto">
						<div className="w-full mx-auto max-w-7xl">
							<h1 className="mb-8 text-3xl font-bold capitalize tracking-[0.02em]">
								{activeTab}
							</h1>
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								{menuItems.map((menuItem) => (
									<TabsContent key={menuItem.value} value={menuItem.value}>
										{menuItem.component !== null ? menuItem.component : null}
									</TabsContent>
								))}
							</Tabs>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}

export default InstructorDashboardPage;
