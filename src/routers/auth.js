const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const { validator } = require("../utils/validator.js");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation amd error handling
    validator(req);
    const { firstName, lastName, emailId, password } = req.body;
    //bycrpt to hash password before saving to db
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password", hashedPassword);
    const users = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await users.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
});
//write login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getjWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successful");
    }
  } catch (error) {
    res.status(500).send("Error loggin in:" + error.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send();
});

module.exports = authRouter;
