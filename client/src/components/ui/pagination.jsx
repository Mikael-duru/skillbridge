import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const handlePrevious = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) onPageChange(currentPage + 1);
	};

	return (
		<div className="flex items-center justify-between mt-8">
			<Button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				size="sm"
				variant={currentPage === 1 ? "default" : "secondary"}
				className="flex items-center justify-center"
			>
				<ChevronLeft /> Previous
			</Button>
			<span className="mx-1 text-xs sm:text-base leading-[21.79px]">
				{currentPage} / {totalPages}
			</span>
			<Button
				onClick={handleNext}
				size="sm"
				disabled={currentPage === totalPages}
				variant={currentPage === totalPages ? "default" : "secondary"}
				className="flex items-center justify-center"
			>
				Next <ChevronRight />
			</Button>
		</div>
	);
};

export default Pagination;
