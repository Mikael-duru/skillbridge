const express = require("express");
const {
	paypalCreateOrder,
	paypalFinalizeOrder,
} = require("../../controllers/student-controller/paypal-order-controller");
const {
	paystackWebhooks,
} = require("../../controllers/student-controller/paystack-order-controller");

const router = express.Router();

router.post("/create", paypalCreateOrder);
router.post("/finalize", paypalFinalizeOrder);
router.post("/paystack/webhooks", paystackWebhooks);

module.exports = router;
