import DataTable from "@/components/table/data-table";
import { columns } from "@/components/table/student-column";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
	const calculateTotalStudentsAndProfit = () => {
		const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
			(acc, course) => {
				const studentCount = course?.students?.length || 0;
				acc.totalStudents += studentCount;

				course.students.forEach((student) => {
					const paidAmount = parseFloat(student?.paidAmount) || 0; // Convert to float
					acc.totalProfit += paidAmount;
					acc.studentList.push({
						courseTitle: course?.title,
						studentName: student?.studentName,
						studentEmail: student?.studentEmail,
					});
				});

				return acc;
			},
			{
				totalStudents: 0,
				totalProfit: 0,
				studentList: [],
			}
		);

		return { totalStudents, totalProfit, studentList };
	};

	const config = [
		{
			icon: Users,
			label: "Total Students",
			value: calculateTotalStudentsAndProfit().totalStudents,
		},
		{
			icon: DollarSign,
			label: "Total Revenue",
			value: new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(calculateTotalStudentsAndProfit().totalProfit.toFixed(2)),
		},
	];

	return (
		<main className="mt-10 font-inter">
			<section className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
				{config.map((item, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">
								{item.label}
							</CardTitle>
							<item.icon className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{item.value}</div>
						</CardContent>
					</Card>
				))}
			</section>
			<section>
				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-extrabold sm:text-3xl lato">
							Students List
						</CardTitle>
					</CardHeader>
					<CardContent className="max-md:p-2">
						<div className="overflow-x-auto">
							<DataTable
								data={calculateTotalStudentsAndProfit().studentList}
								columns={columns}
								searchKey="studentName"
							/>
						</div>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}

export default InstructorDashboard;
