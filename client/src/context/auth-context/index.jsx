import { useEffect, useState } from "react";

import {
	initialForgotPasswordFormData,
	initialSignInFormData,
	initialSignUpFormData,
} from "@/config";
import { checkAuth, login, register, resetPassword } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "./auth-context";
import { toast } from "react-toastify";

export default function AuthProvider({ children }) {
	const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
	const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
	const [forgotPasswordFormData, setForgotPasswordFormData] = useState(
		initialForgotPasswordFormData
	);
	const [auth, setAuth] = useState({
		authenticate: false,
		user: null,
	});
	const [loading, setLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [activeTabToSignIn, setActiveTabToSignIn] = useState(false);

	const handleRegisterUser = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const data = await register(signUpFormData);

			if (data.success) {
				setSignUpFormData(initialSignUpFormData);
				setActiveTabToSignIn(true);
				toast.success("Account created successfully!");
			}
		} catch (error) {
			console.error("[Error_Sign_Up]:", error?.response?.data);
			toast.error(
				error?.response?.data?.message ||
					"An error occurred while creating your account."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoginUser = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const data = await login(signInFormData);

			if (data.success) {
				sessionStorage.setItem(
					"accessToken",
					JSON.stringify(data.data.accessToken)
				);
				setAuth({
					authenticate: true,
					user: data.data.user,
				});
				setSignInFormData(initialSignInFormData);
			} else {
				setAuth({
					authenticate: false,
					user: null,
				});
			}
		} catch (error) {
			console.error("[Error_Sign_In]:", error?.response?.data);
			toast.error(
				error?.response?.data?.message || "An error occurred while logging in."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const data = await resetPassword(forgotPasswordFormData);
			if (data.success) {
				setForgotPasswordFormData(initialForgotPasswordFormData);
				toast.success("Password changed successfully!");
				setActiveTabToSignIn(true);
			}
		} catch (error) {
			toast.error(
				error?.response?.data?.message ||
					"An error occurred while changing password."
			);
			console.error("[Error_Change_Password]:", error?.response?.data?.message);
		} finally {
			setIsLoading(false);
		}
	};

	const checkAuthUser = async () => {
		setLoading(true);

		const token = sessionStorage.getItem("accessToken");

		if (!token) {
			setAuth({
				authenticate: false,
				user: null,
			});
			setLoading(false);
			return;
		}

		try {
			const data = await checkAuth();

			if (data.success) {
				setAuth({
					authenticate: true,
					user: data.data.user,
				});
			} else {
				setAuth({
					authenticate: false,
					user: null,
				});
			}
		} catch (error) {
			console.error("[Error_Checking_Auth]:", error?.response?.data);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuthUser();
	}, []);

	const resetCredentials = () => {
		setAuth({
			authenticate: false,
			user: null,
		});
	};

	return (
		<AuthContext.Provider
			value={{
				signInFormData,
				setSignInFormData,
				signUpFormData,
				setSignUpFormData,
				forgotPasswordFormData,
				setForgotPasswordFormData,
				handleRegisterUser,
				handleLoginUser,
				handleChangePassword,
				isLoading,
				auth,
				resetCredentials,
				activeTabToSignIn,
			}}
		>
			{loading ? <Skeleton /> : children}
		</AuthContext.Provider>
	);
}
