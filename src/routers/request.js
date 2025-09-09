const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("connection request");
  res.send(user.firstName + " sent you a request");
});

module.exports = requestRouter;
