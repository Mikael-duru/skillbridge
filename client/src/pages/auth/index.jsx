import { useContext, useEffect, useState } from "react";

import CommonForm from "@/components/common-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	forgotPasswordFormControls,
	signInFormControls,
	signUpFormControls,
} from "@/config";
import { AuthContext } from "@/context/auth-context/auth-context";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

function AuthPage() {
	const [activeTab, setActiveTab] = useState(
		() => sessionStorage.getItem("authTab") || "signin"
	);

	const {
		signInFormData,
		setSignInFormData,
		signUpFormData,
		setSignUpFormData,
		forgotPasswordFormData,
		setForgotPasswordFormData,
		handleRegisterUser,
		handleLoginUser,
		handleChangePassword,
		activeTabToSignIn,
	} = useContext(AuthContext);

	const handleToggleChangePasswordTab = () => {
		setActiveTab("changePassword");
	};

	useEffect(() => {
		// Update sessionStorage whenever activeTab changes
		sessionStorage.setItem("authTab", activeTab);
	}, [activeTab]);

	// Clears session storage when you leave the page
	useEffect(() => {
		return () => {
			sessionStorage.removeItem("authTab");
		};
	}, []);

	const checkIfSignInFormIsValid = () => {
		return (
			signInFormData &&
			signInFormData.userEmail !== "" &&
			signInFormData.userPassword !== "" &&
			signInFormData.userPassword.length >= 6
		);
	};

	const checkIfSignUpFormIsValid = () => {
		return (
			signUpFormData &&
			signUpFormData.fullName !== "" &&
			signUpFormData.userEmail !== "" &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpFormData.userEmail) &&
			signUpFormData.password !== "" &&
			signUpFormData.password.length >= 6 &&
			/^(?=.*[a-zA-Z])(?=.*\d)/.test(signUpFormData.password)
		);
	};

	const checkIfChangePasswordFormIsValid = () => {
		return (
			forgotPasswordFormData &&
			forgotPasswordFormData.userEmail !== "" &&
			forgotPasswordFormData.newPassword !== "" &&
			forgotPasswordFormData.newPassword.length >= 6 &&
			forgotPasswordFormData.confirmPassword !== "" &&
			forgotPasswordFormData.confirmPassword.length >= 6
		);
	};

	useEffect(() => {
		if (activeTabToSignIn) {
			setActiveTab("signin");
		}
	}, [activeTabToSignIn]);

	return (
		<main className="container mx-auto">
			<div className="flex flex-col min-h-screen font-inter">
				<Header />

				<div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-background px-[5%] font-inter py-12">
					<Tabs
						value={activeTab}
						defaultValue="signin"
						onValueChange={(value) => setActiveTab(value)}
						className="w-full max-w-md"
					>
						{activeTab !== "changePassword" && (
							<TabsList className="grid w-full grid-cols-2 mb-3">
								<TabsTrigger value="signin">Sign In</TabsTrigger>
								<TabsTrigger value="signup">Sign Up</TabsTrigger>
							</TabsList>
						)}

						<TabsContent value="signin">
							<Card className="py-2 sm:px-6">
								<CardHeader>
									<CardTitle className="text-lg">
										Sign in to your account
									</CardTitle>
									<CardDescription>
										Enter your credentials to access your account.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<CommonForm
										formControls={signInFormControls}
										buttonText={"Sign In"}
										formData={signInFormData}
										setFormData={setSignInFormData}
										isButtonDisabled={!checkIfSignInFormIsValid()}
										handleSubmit={handleLoginUser}
										setChangePasswordTab={handleToggleChangePasswordTab}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="changePassword">
							<Card className="py-2 sm:px-6">
								<CardHeader>
									<CardTitle className="text-lg">Change Password</CardTitle>
									<CardDescription>
										Change your password here. After saving, you&apos;ll be
										redirected to sign-in.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<CommonForm
										formControls={forgotPasswordFormControls}
										buttonText={"Change Password"}
										formData={forgotPasswordFormData}
										setFormData={setForgotPasswordFormData}
										isButtonDisabled={!checkIfChangePasswordFormIsValid()}
										handleSubmit={handleChangePassword}
										setChangePasswordTab={handleToggleChangePasswordTab}
									/>
								</CardContent>
								<div className="text-center">
									<Button
										variant="ghost"
										onClick={() => {
											setActiveTab("signin");
										}}
									>
										<ArrowLeftIcon />
										Return
									</Button>
								</div>
							</Card>
						</TabsContent>

						<TabsContent value="signup">
							<Card className="py-2 sm:px-6">
								<CardHeader>
									<CardTitle className="text-lg">
										Create a new account
									</CardTitle>
									<CardDescription>
										Enter your details to get started.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<CommonForm
										formControls={signUpFormControls}
										buttonText={"Sign Up"}
										formData={signUpFormData}
										setFormData={setSignUpFormData}
										isButtonDisabled={!checkIfSignUpFormIsValid()}
										handleSubmit={handleRegisterUser}
									/>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</main>
	);
}

export default AuthPage;
