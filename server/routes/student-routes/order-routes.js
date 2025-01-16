const express = require("express");
const {
	createOrder,
	finalizeOrder,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/finalize", finalizeOrder);

module.exports = router;
