const express = require("express");
const profileRouter = express.Router();
const { ValidateEditProfile } = require("../utils/validator.js");
const bcrypt = require("bcrypt");

const User = require("../models/user.js");

const { userAuth } = require("../middlewares/auth.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error " + error.message);
  }
});
profileRouter.post("/profile/update", userAuth, async (req, res) => {
  try {
    if (!ValidateEditProfile(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInuser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));

    await loggedInuser.save();

    res.json({
      message: `${loggedInuser.firstName}Profile updated succesfully`,
      data: loggedInuser,
    });
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword, password } = req.body;
    const user = req.user;
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.send("Password updated Successfully");
    } else {
      res.send("Password wrong! enter password correctly!");
    }
  } catch (error) {
    res.status(500).send("Error creating password" + error.message);
  }
});

module.exports = profileRouter;
