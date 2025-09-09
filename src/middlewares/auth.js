const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    //console.log(token);
    const decodedMessage = await jwt.verify(token, "Varun@123");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    console.log(user);
    if (!user) {
      console.log("User not found ");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send("Error token generation" + error.message);
  }
};

module.exports = {
  userAuth,
};
