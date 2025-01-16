import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/auth-context";
import InstructorProvider from "./context/instructor-context";
import StudentProvider from "./context/student-context";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<AuthProvider>
			<InstructorProvider>
				<StudentProvider>
					<App />
				</StudentProvider>
			</InstructorProvider>
		</AuthProvider>
	</BrowserRouter>
);
