const express = require("express");
const dbConnect = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const requestRouter = require("./routers/request.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
