import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData, setFormData }) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [errors, setErrors] = useState({});

	// Toggle password visibility
	const togglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev);
	};

	// Validation function
	const validateField = (name, value) => {
		let error = "";

		if (!value) {
			if (name === "fullName") {
				error = "Full name is required.";
			} else if (name === "email" || name === "userEmail") {
				error = "Email is required.";
			} else if (
				name === "password" ||
				name === "userPassword" ||
				name === "newPassword"
			) {
				error = "Password is required.";
			} else if (name === "confirmPassword") {
				error = "Confirm password is required.";
			} else {
				error = `${name} is required.`;
			}
		} else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			error = "Invalid email address.";
		} else if (name === "password" && value.length < 6) {
			error = "Password must be at least 6 characters";
		} else if (name === "password" && !/^(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
			error = "Password must contain both letters and numbers";
		}

		setErrors((prev) => ({
			...prev,
			[name]: error,
		}));
	};

	const handleChange = (name, value) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		validateField(name, value); // Validate the field on change
	};

	const renderComponentByType = (getControlItem) => {
		let element = null;
		const controlItemValue = formData[getControlItem.name] || "";
		const inputType =
			getControlItem.type === "password" && !isPasswordVisible
				? "password"
				: "text";

		switch (getControlItem.componentType) {
			case "input":
				element = (
					<div className="relative">
						<Input
							type={inputType}
							id={getControlItem.name}
							name={getControlItem.name}
							placeholder={getControlItem.placeholder}
							value={controlItemValue}
							onChange={(e) =>
								handleChange(getControlItem.name, e.target.value)
							}
							onBlur={() =>
								validateField(getControlItem.name, controlItemValue)
							}
						/>
						{getControlItem.type === "password" && (
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="absolute top-2 right-2.5"
							>
								{isPasswordVisible ? (
									<EyeOff className="text-gray-500 size-5" />
								) : (
									<Eye className="text-gray-400 size-5" />
								)}
							</button>
						)}
					</div>
				);
				break;

			case "select":
				element = (
					<Select
						value={controlItemValue}
						onValueChange={(value) => handleChange(getControlItem.name, value)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select option" />
						</SelectTrigger>
						<SelectContent>
							{getControlItem.options && getControlItem.options.length > 0
								? getControlItem.options.map((optionItem) => (
										<SelectItem key={optionItem.id} value={optionItem.id}>
											{optionItem.label}
										</SelectItem>
								  ))
								: null}
						</SelectContent>
					</Select>
				);
				break;

			case "textarea":
				element = (
					<Textarea
						id={getControlItem.name}
						name={getControlItem.name}
						placeholder={getControlItem.placeholder}
						value={controlItemValue}
						onChange={(e) => handleChange(getControlItem.name, e.target.value)}
						onBlur={() => validateField(getControlItem.name, controlItemValue)}
					/>
				);
				break;

			default:
				element = (
					<Input
						type={inputType}
						id={getControlItem.name}
						name={getControlItem.name}
						placeholder={getControlItem.placeholder}
						value={controlItemValue}
						onChange={(e) => handleChange(getControlItem.name, e.target.value)}
						onBlur={() => validateField(getControlItem.name, controlItemValue)}
						// onChange={(e) =>
						// 	setFormData({
						// 		...formData,
						// 		[getControlItem.name]: e.target.value,
						// 	})
						// }
					/>
				);
				break;
		}

		return element;
	};

	return (
		<div className="flex flex-col gap-3">
			{formControls.map((controlItem) => (
				<div key={controlItem.name}>
					<Label htmlFor={controlItem.name}>{controlItem.label}</Label>
					{renderComponentByType(controlItem)}
					{errors[controlItem.name] && (
						<p className="pt-1 text-sm text-red-500">
							{errors[controlItem.name]}
						</p>
					)}
				</div>
			))}
		</div>
	);
}

export default FormControls;
