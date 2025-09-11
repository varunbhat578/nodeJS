const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { connectionSchemaRequest } = require("../models/request.js");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.indludes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }
      const toUser = await User.findById(toUserId);

      //If there is an existing connectionRequest
      const existingConnectionRequest = await connectionSchemaRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send("Connection already exists");
      }
      const touser = User.findById(toUserId);
      if (!touser) {
        return res.status(404).json({ message: "User not found!" });
      }
      const connectionRequest = new connectionSchemaRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({ message: `Connection ${status} sent successfully`, data });
    } catch (error) {
      res.send("Error" + error.message);
    }
  }
);

module.exports = requestRouter;
