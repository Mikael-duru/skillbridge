import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function TableActionsButton({ courseId }) {
	const navigate = useNavigate();

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => navigate(`/instructor/courses/edit/${courseId}`)}
			>
				<Edit className="size-6" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="text-red-500 hover:text-red-600"
			>
				<Trash2 className="size-6" />
			</Button>
		</>
	);
}

export default TableActionsButton;
