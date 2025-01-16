import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
	columnHelper.accessor("courseTitle", {
		header: () => <h2 className="">Course Title</h2>,
		cell: (info) => info.getValue(),
	}),

	columnHelper.accessor("studentName", {
		header: () => <h2 className="text-center">Student Name</h2>,
		cell: (info) => <p className="text-center">{info.getValue()}</p>,
	}),

	columnHelper.accessor("studentEmail", {
		header: () => <h2 className="text-center">Student Email</h2>,
		cell: (info) => <p className="text-center">{info.getValue()}</p>,
	}),
];
