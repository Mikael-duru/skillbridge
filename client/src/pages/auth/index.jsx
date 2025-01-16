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
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context/auth-context";
import Header from "@/components/ui/header";

function AuthPage() {
	const [activeTab, setActiveTab] = useState(
		() => sessionStorage.getItem("authTab") || "signin"
	);
	const {
		signInFormData,
		setSignInFormData,
		signUpFormData,
		setSignUpFormData,
		handleRegisterUser,
		handleLoginUser,
		activeTabToSignIn,
	} = useContext(AuthContext);

	useEffect(() => {
		sessionStorage.removeItem("currentTab", activeTab);
	}, []);

	useEffect(() => {
		// Update sessionStorage whenever activeTab changes
		sessionStorage.setItem("authTab", activeTab);
	}, [activeTab]);

	const checkIfSignInFormIsValid = () => {
		return (
			signInFormData &&
			signInFormData.userNameOrEmail !== "" &&
			signInFormData.userPassword !== "" &&
			signInFormData.userPassword.length >= 6
		);
	};

	const checkIfSignUpFormIsValid = () => {
		return (
			signUpFormData &&
			signUpFormData.fullName !== "" &&
			signUpFormData.userName !== "" &&
			!signUpFormData.userName.includes("@") &&
			signUpFormData.userEmail !== "" &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpFormData.userEmail) &&
			signUpFormData.password !== "" &&
			signUpFormData.password.length >= 6 &&
			/^(?=.*[a-zA-Z])(?=.*\d)/.test(signUpFormData.password)
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

				<div className="flex items-center justify-center min-h-screen bg-background px-[5%] font-inter py-5">
					<Tabs
						value={activeTab}
						defaultValue="signin"
						onValueChange={(value) => setActiveTab(value)}
						className="w-full max-w-md"
					>
						<TabsList className="grid w-full grid-cols-2 mb-3">
							<TabsTrigger value="signin">Sign In</TabsTrigger>
							<TabsTrigger value="signup">Sign Up</TabsTrigger>
						</TabsList>
						<TabsContent value="signin">
							<Card className="py-2 space-y-4 sm:px-6">
								<CardHeader>
									<CardTitle className="text-center">
										Sign in to your account
									</CardTitle>
									<CardDescription className="pb-3 text-center">
										Enter your credentials to access your account.
									</CardDescription>
									<CardContent className="px-0 pb-1 space-y-2">
										<CommonForm
											formControls={signInFormControls}
											buttonText={"Sign In"}
											formData={signInFormData}
											setFormData={setSignInFormData}
											isButtonDisabled={!checkIfSignInFormIsValid()}
											handleSubmit={handleLoginUser}
										/>
									</CardContent>
								</CardHeader>
							</Card>
						</TabsContent>
						<TabsContent value="signup">
							<Card className="py-2 space-y-4 sm:px-6">
								<CardHeader>
									<CardTitle className="text-center">
										Create a new account
									</CardTitle>
									<CardDescription className="pb-3 text-center">
										Enter your details to get started.
									</CardDescription>
									<CardContent className="px-0 pb-1 space-y-2">
										<CommonForm
											formControls={signUpFormControls}
											buttonText={"Sign Up"}
											formData={signUpFormData}
											setFormData={setSignUpFormData}
											isButtonDisabled={!checkIfSignUpFormIsValid()}
											handleSubmit={handleRegisterUser}
										/>
									</CardContent>
								</CardHeader>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</main>
	);
}

export default AuthPage;
