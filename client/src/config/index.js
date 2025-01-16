export const signUpFormControls = [
	{
		name: "fullName",
		label: "Full Name",
		type: "text",
		placeholder: "Enter your full name",
		componentType: "input",
	},
	{
		name: "userName",
		label: "Username",
		type: "text",
		placeholder: "Enter a username",
		componentType: "input",
	},
	{
		name: "userEmail",
		label: "Email",
		type: "email",
		placeholder: "Enter your email",
		componentType: "input",
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "Enter your password",
		componentType: "input",
	},
];

export const signInFormControls = [
	{
		name: "userNameOrEmail",
		label: "Email or Username",
		type: "text",
		placeholder: "Enter your email or user name",
		componentType: "input",
	},
	{
		name: "userPassword",
		label: "Password",
		type: "password",
		placeholder: "Enter your password",
		componentType: "input",
	},
];

export const initialSignInFormData = {
	userNameOrEmail: "",
	userPassword: "",
};

export const initialSignUpFormData = {
	fullName: "",
	userName: "",
	userEmail: "",
	password: "",
};

export const languageOptions = [
	{ id: "english", label: "English" },
	{ id: "spanish", label: "Spanish" },
	{ id: "french", label: "French" },
	{ id: "german", label: "German" },
	{ id: "chinese", label: "Chinese" },
	{ id: "japanese", label: "Japanese" },
	{ id: "korean", label: "Korean" },
	{ id: "portuguese", label: "Portuguese" },
	{ id: "arabic", label: "Arabic" },
	{ id: "russian", label: "Russian" },
];

export const courseLevelOptions = [
	{ id: "beginner", label: "Beginner" },
	{ id: "intermediate", label: "Intermediate" },
	{ id: "advanced", label: "Advanced" },
];

export const courseCategories = [
	{ id: "web-development", label: "Web Development" },
	{ id: "backend-development", label: "Backend Development" },
	{ id: "data-science", label: "Data Science" },
	{ id: "machine-learning", label: "Machine Learning" },
	{ id: "artificial-intelligence", label: "Artificial Intelligence" },
	{ id: "cloud-computing", label: "Cloud Computing" },
	{ id: "cyber-security", label: "Cyber Security" },
	{ id: "mobile-development", label: "Mobile Development" },
	{ id: "game-development", label: "Game Development" },
	{ id: "software-engineering", label: "Software Engineering" },
];

export const courseLandingPageFormControls = [
	{
		name: "title",
		label: "Title",
		componentType: "input",
		type: "text",
		placeholder: "Enter course title",
	},
	{
		name: "category",
		label: "Category",
		componentType: "select",
		type: "text",
		placeholder: "",
		options: courseCategories,
	},
	{
		name: "level",
		label: "Level",
		componentType: "select",
		type: "text",
		placeholder: "",
		options: courseLevelOptions,
	},
	{
		name: "primaryLanguage",
		label: "Primary Language",
		componentType: "select",
		type: "text",
		placeholder: "",
		options: languageOptions,
	},
	{
		name: "subtitle",
		label: "Subtitle",
		componentType: "input",
		type: "text",
		placeholder: "Enter course subtitle",
	},
	{
		name: "description",
		label: "Description",
		componentType: "textarea",
		type: "text",
		placeholder: "Enter course description",
	},
	{
		name: "pricing",
		label: "Pricing",
		componentType: "input",
		type: "number",
		placeholder: "Enter course pricing",
	},
	{
		name: "objectives",
		label: "Objectives",
		componentType: "textarea",
		type: "text",
		placeholder: "Enter course objectives",
	},
	{
		name: "welcomeMessage",
		label: "Welcome Message",
		componentType: "textarea",
		placeholder: "Welcome message for students",
	},
];

export const courseLandingInitialFormData = {
	title: "",
	category: "",
	level: "",
	primaryLanguage: "",
	subtitle: "",
	description: "",
	pricing: "",
	objectives: "",
	welcomeMessage: "",
	image: {
		imageUrl: "",
		public_id: "",
	},
};

export const CourseCurriculumInitialFormData = [
	{
		title: "",
		videoUrl: "",
		freePreview: false,
		public_id: "",
	},
];

export const sortOptions = [
	{ id: "price-lowtohigh", label: "Price: Low to High" },
	{ id: "price-hightolow", label: "Price: High to Low" },
	{ id: "title-atoz", label: "Title: A to Z" },
	{ id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
	categories: courseCategories,
	levels: courseLevelOptions,
	primaryLanguages: languageOptions,
};
