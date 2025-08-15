const mongoose = require("mongoose");

const dbConnect = async () => {
  mongoose.connect(
    "mongodb+srv://varun:Varun123@namastenode.7yib8v0.mongodb.net/devTinder"
  );
};
module.exports = dbConnect;
