const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("please Login");
    }
    //console.log(token);
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);

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
