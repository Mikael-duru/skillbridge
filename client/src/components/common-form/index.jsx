import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
	handleSubmit,
	buttonText,
	formControls = [],
	formData,
	setFormData,
	isButtonDisabled = false,
	setChangePasswordTab = () => {},
}) {
	return (
		<form onSubmit={handleSubmit}>
			{/* Render form controls here */}
			<FormControls
				formControls={formControls}
				formData={formData}
				setFormData={setFormData}
			/>
			{buttonText === "Sign In" && (
				<p className="mt-2 text-sm text-gray-500 text-end">
					<a
						className="cursor-pointer hover:underline"
						onClick={setChangePasswordTab}
					>
						Forgot password?
					</a>
				</p>
			)}
			<Button
				type="submit"
				className="w-full mt-5 font-bold tracking-wide"
				variant={`${!isButtonDisabled ? "secondary" : "default"}`}
				disabled={isButtonDisabled}
			>
				{buttonText || "Submit"}
			</Button>
		</form>
	);
}

export default CommonForm;
