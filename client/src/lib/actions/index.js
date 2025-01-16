import { default as axiosInstance } from "@/api/axiosInstance";

export const register = async (formData) => {
	const { data } = await axiosInstance.post("/auth/register", {
		...formData,
		role: "user",
	});

	return data;
};

export const login = async (formData) => {
	const { data } = await axiosInstance.post("/auth/login", {
		...formData,
	});

	return data;
};

export const checkAuth = async () => {
	const { data } = await axiosInstance.get("/auth/check-auth");

	return data;
};

export const mediaUpload = async (formData, onProgressCallback) => {
	const { data } = await axiosInstance.post("/media/upload", formData, {
		onUploadProgress: (ProgressEvent) => {
			const percentCompleted = Math.round(
				(ProgressEvent.loaded * 100) / ProgressEvent.total
			);
			onProgressCallback(percentCompleted);
		},
	});

	return data;
};

export const mediaBulkUpload = async (formData, onProgressCallback) => {
	const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
		onUploadProgress: (ProgressEvent) => {
			const percentCompleted = Math.round(
				(ProgressEvent.loaded * 100) / ProgressEvent.total
			);
			onProgressCallback(percentCompleted);
		},
	});

	return data;
};

export const mediaDelete = async (id) => {
	const { data } = await axiosInstance.delete(`/media/delete/${id}`);

	return data;
};

export const addNewCourse = async (formData) => {
	const { data } = await axiosInstance.post("/instructor/course/add", formData);

	return data;
};

export const getAllCourses = async () => {
	const { data } = await axiosInstance.get("/instructor/course/get");

	return data;
};

// export const getCoursesByInstructorId = async (id) => {
// 	const { data } = await axiosInstance.get(`/instructor/course/get/${id}`);

// 	return data;
// };

export const getCourseDetailsById = async (id) => {
	const { data } = await axiosInstance.get(
		`/instructor/course/get/details/${id}`
	);

	return data;
};

export const updateCourseById = async (id, formData) => {
	const { data } = await axiosInstance.put(
		`/instructor/course/update/${id}`,
		formData
	);

	return data;
};

export const getStudentCourseList = async (query) => {
	const { data } = await axiosInstance.get(`/student/course/get?${query}`);

	return data;
};

export const getStudentCourseDetailsById = async (courseId) => {
	const { data } = await axiosInstance.get(
		`/student/course/get/details/${courseId}`
	);

	return data;
};

export const createPayment = async (formData) => {
	const { data } = await axiosInstance.post("/student/order/create", formData);

	return data;
};

export const captureAndFinalizePayment = async (
	paymentId,
	payerId,
	orderId
) => {
	const { data } = await axiosInstance.post("/student/order/finalize", {
		paymentId,
		payerId,
		orderId,
	});

	return data;
};

export const getStudentBoughtCourseById = async (studentId) => {
	const { data } = await axiosInstance.get(
		`/student/bought-courses/get/${studentId}`
	);

	return data;
};

export const checkCoursePurchaseInfo = async (courseId, studentId) => {
	const { data } = await axiosInstance.get(
		`/student/course/purchase-info/${courseId}/${studentId}`
	);

	return data;
};

export const getCourseProgress = async (studentId, courseId) => {
	const { data } = await axiosInstance.get(
		`/student/courses-progress/get/${studentId}/${courseId}`
	);

	return data;
};

export const markLectureAsViewed = async (studentId, courseId, lectureId) => {
	const { data } = await axiosInstance.post(
		"/student/courses-progress/mark-lecture-as-viewed",
		{
			studentId,
			courseId,
			lectureId,
		}
	);

	return data;
};

export const resetCourseProgress = async (studentId, courseId) => {
	const { data } = await axiosInstance.post(
		"student/courses-progress/reset-course-progress",
		{
			studentId,
			courseId,
		}
	);

	return data;
};
