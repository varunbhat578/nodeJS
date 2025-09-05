const express = require("express");
const dbConnect = require("./config/database.js");

const app = express();
const User = require("./models/user.js");
app.use(express.json());

app.post("/signup", async (req, res) => {
  const users = new User(req.body);
  try {
    await users.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
});
// Retrieve a user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});
// Retrieve all users
app.get("/find", async (req, res) => {
  //  const userEmail = req.body.emailId;

  try {
    const foundResult = await User.find({});

    if (foundResult) {
      res.send(foundResult);
    }
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deleteResult = await User.findByIdAndDelete({ _id: userId });
    console.log("Trying to delete:", userId);
    if (!deleteResult) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body;

  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "photoURL",
      "description",
      "skills",
    ];
    const isValid = Object.keys(updatedData).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isValid) {
      throw new Error("Invalid updates!");
    }
    await User.findByIdAndUpdate({ _id: userId }, updatedData, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
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
