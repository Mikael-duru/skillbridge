import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
	ChevronLeft,
	ChevronRight,
	// ChevronsLeft,
	// ChevronsRight,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

function DataTable({ data, columns, searchKey }) {
	const [columnFilters, setColumnFilters] = useState([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
		},
		onColumnFiltersChange: setColumnFilters,
		initialState: {
			pagination: {
				pageSize: 5,
			},
		},
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="mx-1 mb-5">
			{/* Search bar */}
			<div className="flex items-center py-4">
				<Input
					placeholder="Search..."
					value={table.getColumn(searchKey)?.getFilterValue() ?? ""}
					onChange={(event) =>
						table.getColumn(searchKey)?.setFilterValue(event.target.value)
					}
					className="w-full max-w-md"
				/>
			</div>

			{/* Table */}
			<div className="border-b border-gray-200">
				<Table>
					{/* Table Header */}
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="border-gray-300">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					{/* Table Body */}
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex flex-col items-center justify-between gap-5 mt-4 text-sm text-gray-700 sm:flex-row">
				{/* Items per page */}
				<div className="self-start flex items-center max-sm:mb-4 w-[165px]">
					<span className="mr-2 shrink-0">Items per page</span>
					<Select
						value={table.getState().pagination.pageSize}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent>
							{[5, 10, 20, 30].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={pageSize}
									className="cursor-pointer font-inter"
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* pagination */}
				<div className="flex items-center space-x-2">
					{/* <Button
						variant="outline"
						size="sm"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronsLeft size={20} />
					</Button> */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeft size={20} />
					</Button>

					<div className="flex items-center">
						<input
							min={1}
							max={table.getPageCount()}
							type="number"
							value={table.getState().pagination.pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								table.setPageIndex(page);
							}}
							className="w-14 px-2 py-[5px] text-center border border-gray-300 rounded-md focus:border-none"
						/>
						<span className="ml-2">of {table.getPageCount()}</span>
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<ChevronRight size={20} />
					</Button>
					{/* <Button
						variant="outline"
						size="sm"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<ChevronsRight size={20} />
					</Button> */}
				</div>
			</div>
		</div>
	);
}

export default DataTable;
