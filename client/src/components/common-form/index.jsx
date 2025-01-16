import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
	handleSubmit,
	buttonText,
	formControls = [],
	formData,
	setFormData,
	isButtonDisabled = false,
}) {
	return (
		<form onSubmit={handleSubmit}>
			{/* Render form controls here */}
			<FormControls
				formControls={formControls}
				formData={formData}
				setFormData={setFormData}
			/>
			<Button
				type="submit"
				className="w-full mt-5 tracking-wide font-bold"
				variant={`${!isButtonDisabled ? "secondary" : "default"}`}
				disabled={isButtonDisabled}
			>
				{buttonText || "Submit"}
			</Button>
		</form>
	);
}

export default CommonForm;
