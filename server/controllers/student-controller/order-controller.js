const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
	try {
		const {
			studentId,
			userName,
			userEmail,
			orderStatus,
			paymentMethod,
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
		} = req.body;

		const create_payment_json = {
			intent: "sale",
			payer: {
				payment_method: "paypal",
			},
			redirect_urls: {
				return_url: `${process.env.CLIENT_URL}/payment/verification`,
				cancel_url: `${process.env.CLIENT_URL}/course/details/${courseId}`,
			},
			transactions: [
				{
					item_list: {
						items: [
							{
								name: courseTitle,
								sku: courseId,
								price: coursePricing,
								currency: "USD",
								quantity: 1,
							},
						],
					},
					amount: {
						currency: "USD",
						total: coursePricing.toFixed(2),
					},
					description: courseTitle,
				},
			],
		};

		paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
			if (error) {
				console.log(error);
				return res.status(500).json({
					success: false,
					message: "Error while creating paypal payment!",
				});
			} else {
				const newlyCreatedCourseOrder = new Order({
					studentId,
					userName,
					userEmail,
					orderStatus,
					paymentMethod,
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
				});

				await newlyCreatedCourseOrder.save();

				const approvalUrl = paymentInfo.links.find(
					(link) => link.rel === "approval_url"
				).href;

				res.status(201).json({
					success: true,
					data: {
						approvalUrl,
						orderId: newlyCreatedCourseOrder._id,
					},
				});
			}
		});
	} catch (e) {
		console.log("PayPal Payment Creation Error:", error.response || error);
		res.status(500).json({
			success: false,
			message: "Some error occurred!",
		});
	}
};

// Capture payment and finalize payment;
const finalizeOrder = async (req, res) => {
	try {
		const { paymentId, payerId, orderId } = req.body;

		let order = await Order.findById(orderId);

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order can not be found",
			});
		}

		(order.paymentStatus = "paid"),
			(order.orderStatus = "confirmed"),
			(order.paymentId = paymentId),
			(order.payerId = payerId),
			await order.save();

		// Update student course model
		const studentCourses = await StudentCourses.findOne({
			studentId: order.studentId,
		});

		if (studentCourses) {
			studentCourses?.courses.push({
				courseId: order.courseId,
				title: order.courseTitle,
				instructorId: order.instructorId,
				instructorName: order.instructorName,
				dateOfPurchase: order.orderDate,
				courseImage: order.courseImage,
			});

			await studentCourses.save();
		} else {
			const newStudentCourses = new StudentCourses({
				studentId: order.studentId,
				courses: [
					{
						courseId: order.courseId,
						title: order.courseTitle,
						instructorId: order.instructorId,
						instructorName: order.instructorName,
						dateOfPurchase: order.orderDate,
						courseImage: order.courseImage,
					},
				],
			});

			await newStudentCourses.save();
		}

		// Update the course schema students
		await Course.findByIdAndUpdate(order?.courseId, {
			$addToSet: {
				students: {
					studentId: order.studentId,
					studentName: order.userName,
					studentEmail: order.userEmail,
					paidAmount: order.coursePricing,
				},
			},
		});

		res.status(200).json({
			success: true,
			message: "Order confirmed",
			data: order,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred!",
		});
	}
};

module.exports = { createOrder, finalizeOrder };
