const express = require("express");
const dbConnect = require("./config/database.js");

const app = express();
const User = require("./models/user.js");

app.post("/signup", async (req, res) => {
  const users = new User({
    firstName: "Varun",
    lastName: "Bhat",
    emailId: "vspayfty@gmail.com",
    password: "password123",
    age: 23,
  });
  try {
    await users.save();
    res.send("User created successfully");
  } catch (error) {
    res.statys(500).send("Error creating user: " + error.message);
  }
});

dbConnect()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });
