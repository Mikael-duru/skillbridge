import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePayment } from "@/lib/actions";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function PaypalPaymentSuccessfulPage() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const paymentId = params.get("paymentId");
	const payerId = params.get("PayerID");

	useEffect(() => {
		if (paymentId && payerId) {
			const capturePayment = async () => {
				const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

				const result = await captureAndFinalizePayment(
					paymentId,
					payerId,
					orderId
				);

				if (result?.success) {
					sessionStorage.removeItem("currentOrderId");
					window.location.href = "/student/course/list";
					toast.success("Order processed successfully!");
				}
			};

			capturePayment();
		}
	}, [paymentId, payerId]);

	return (
		<main className="w-full h-[80vh] mt-6 flex items-center justify-center">
			<div className="w-full sm:w-[400px]">
				<Card>
					<CardHeader>
						<CardTitle className="mb-3 text-center">
							Processing order... Please wait!
						</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center justify-center">
						<div className="loader"></div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}

export default PaypalPaymentSuccessfulPage;
