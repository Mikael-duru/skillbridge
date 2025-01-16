import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";

function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<main className="container mx-auto font-inter">
			<div className="flex flex-col min-h-screen">
				<Header />

				<section className="flex items-center justify-center h-screen py-5 font-lato">
					<div className="text-center">
						<h2 className="mt-8 max-sm:text-2xl text-[2.5rem]">
							Oops! Page not found.
						</h2>
						<div className="lg:h-[360px]">
							<img
								src="/src/assets/404.png"
								alt="404"
								className="w-[600px] max-w-[75%] mx-auto"
							/>
						</div>
						<h4 className="mb-5 text-xl max-sm:text-base">
							The page you are looking for cannot be found.
						</h4>
						<Button
							type="button"
							className="font-bold mb-10 tracking-[0.02em] font-lato"
							variant="secondary"
							onClick={() => navigate(-1)}
						>
							Go Back
						</Button>
					</div>
				</section>
			</div>
		</main>
	);
}

export default NotFoundPage;
