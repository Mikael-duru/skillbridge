import { Loader2Icon } from "lucide-react";
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
	isLoading = false,
}) {
	return (
		<form onSubmit={handleSubmit}>
			{/* Render form controls here */}
			<FormControls
				formControls={formControls}
				formData={formData}
				setFormData={setFormData}
			/>
			{buttonText && buttonText === "Sign In" && (
				<p className="mt-2 text-sm text-gray-700 text-end">
					<a
						className={`cursor-pointer hover:underline ${
							isLoading ? "pointer-events-none text-gray-400" : ""
						}`}
						onClick={(e) => {
							if (isLoading) {
								e.preventDefault();
								return;
							}
							setChangePasswordTab();
						}}
					>
						Forgot password?
					</a>
				</p>
			)}
			<Button
				type="submit"
				className="w-full mt-5 font-bold tracking-wide"
				variant={`${!isButtonDisabled ? "secondary" : "default"}`}
				disabled={isButtonDisabled || isLoading}
			>
				{isLoading && (
					<span className="animate-spin">
						<Loader2Icon />
					</span>
				)}
				{buttonText || "Submit"}
			</Button>
		</form>
	);
}

export default CommonForm;
