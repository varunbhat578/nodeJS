const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router;
const razorpayInstance = require("../utils/razorpay.js");
const Payment = require("../models/payments.js");
const { memberShipAmount } = require("../utils/constants.js");
const User = require("../models/user.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
paymentRouter.post("payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = razorpayInstance.orders.create({
      amount: memberShipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipTyoe: membershipType,
      },
    });
    const Payment = new payment({
      userId: req.user._id,
      orderId: order._id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await Payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: process.env.KEY_ID });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["x-raxorpay-signature"];
    const iswebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!iswebhookValid) {
      return res.status(400).json({ msg: "Webhook is not valid" });
    }
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    const user = User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();
    // if (req.body.event === "payment.captured") {
    //  }
    //  if (req.body.event === "payment.failed") {
    //  }
    return res.status(200).json({ mesg: "Webhook data sent succesfully" });
  } catch (error) {
    console.log(error.message);
  }
});
module.exports = paymentRouter;
