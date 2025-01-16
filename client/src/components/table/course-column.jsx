import { createColumnHelper } from "@tanstack/react-table";

import TableActionsButton from "./actions-btn";

const columnHelper = createColumnHelper();

export const columns = [
	columnHelper.accessor("title", {
		header: () => <h2 className="">Courses</h2>,
		cell: (info) => info.getValue(),
	}),

	columnHelper.accessor("students", {
		header: () => <h2 className="text-center">Students</h2>,
		cell: (info) => <p className="text-center">{info.getValue()?.length}</p>,
	}),

	columnHelper.accessor("pricing", {
		header: () => <h2 className="text-center">Revenue</h2>,
		cell: (info) => {
			const pricing = info.getValue();
			const studentsCount = info.row.original.students.length; // Get the students count from the row
			const totalRevenue = pricing * studentsCount;
			return <p className="text-center">${totalRevenue.toFixed(2)}</p>;
		},
	}),

	columnHelper.display({
		id: "actions",
		header: () => <h2 className="text-center">Actions</h2>,
		cell: ({ row }) => (
			<div className="text-center">
				<TableActionsButton courseId={`${row.original._id}`} />
			</div>
		),
	}),
];
