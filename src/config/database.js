const mongoose = require("mongoose");

const dbConnect = async () => {
  mongoose.connect(process.env.MONGODB_URI);
};
module.exports = dbConnect;
