import { useEffect, useState } from "react";

import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuth, login, register } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "./auth-context";
import { toast } from "react-toastify";

export default function AuthProvider({ children }) {
	const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
	const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
	const [auth, setAuth] = useState({
		authenticate: false,
		user: null,
	});
	const [loading, setLoading] = useState(true);
	const [activeTabToSignIn, setActiveTabToSignIn] = useState(false);

	const handleRegisterUser = async (e) => {
		e.preventDefault();

		try {
			const data = await register(signUpFormData);

			if (data.success) {
				setSignUpFormData(initialSignUpFormData);
				setActiveTabToSignIn(true);
				toast.success("Account created successfully!");
			}
		} catch (error) {
			console.error("[Error_Sign_Up]:", error?.response?.data);
		}
	};

	const handleLoginUser = async (e) => {
		e.preventDefault();

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
				handleRegisterUser,
				handleLoginUser,
				auth,
				resetCredentials,
				activeTabToSignIn,
			}}
		>
			{loading ? <Skeleton /> : children}
		</AuthContext.Provider>
	);
}
