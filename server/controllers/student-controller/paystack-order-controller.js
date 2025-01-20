const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const crypto = require("crypto");

const paystackWebhooks = async (req, res) => {
	try {
		const rawBody = await JSON.stringify(req.body);
		const signature = req.headers["x-paystack-signature"];

		// Verify Paystack signature
		const hash = crypto
			.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
			.update(rawBody)
			.digest("hex");

		if (hash !== signature) {
			return res.status(400).json({ message: "Invalid Signature" });
		}

		const event = JSON.parse(rawBody);

		if (event.event === "charge.success" && event.data.status === "success") {
			const { paymentPayload } = event.data.metadata;

			const {
				studentId,
				userName,
				userEmail,
				orderStatus,
				paymentStatus,
				orderDate,
				paymentId,
				payerId,
				instructorId,
				instructorName,
				courseImage,
				courseTitle,
				courseId,
				coursePricing,
			} = paymentPayload;

			const updatedOrderStatus = "Confirmed";
			const updatedPaymentStatus = "Paid";
			const updatedPaymentId = event?.data?.reference;
			const updatedPayerId = event?.data?.customer?.id;
			const paymentMethod = "Paystack";

			const newlyCreatedCourseOrder = new Order({
				studentId,
				userName,
				userEmail,
				orderStatus: updatedOrderStatus,
				paymentMethod,
				paymentStatus: updatedPaymentStatus,
				orderDate,
				paymentId: updatedPaymentId,
				payerId: updatedPayerId,
				instructorId,
				instructorName,
				courseImage,
				courseTitle,
				courseId,
				coursePricing,
			});

			await newlyCreatedCourseOrder.save();

			// Update student course model
			const studentCourses = await StudentCourses.findOne({
				studentId: studentId,
			});

			if (studentCourses) {
				studentCourses?.courses.push({
					courseId: courseId,
					title: courseTitle,
					instructorId: instructorId,
					instructorName: instructorName,
					dateOfPurchase: orderDate,
					courseImage: courseImage,
				});

				await studentCourses.save();
			} else {
				const newStudentCourses = new StudentCourses({
					studentId: studentId,
					courses: [
						{
							courseId: courseId,
							title: courseTitle,
							instructorId: instructorId,
							instructorName: instructorName,
							dateOfPurchase: orderDate,
							courseImage: courseImage,
						},
					],
				});

				await newStudentCourses.save();
			}

			// Update the course schema students
			await Course.findByIdAndUpdate(courseId, {
				$addToSet: {
					students: {
						studentId: studentId,
						studentName: userName,
						studentEmail: userEmail,
						paidAmount: coursePricing,
					},
				},
			});

			res.status(200).json({
				success: true,
				message: "Order confirmed",
			});
		}
	} catch (e) {
		console.log("[Paystack Payment Error]:", e);
		res.status(500).json({
			success: false,
			message: "Paystack Payment - Some error occurred!",
		});
	}
};

module.exports = { paystackWebhooks };
