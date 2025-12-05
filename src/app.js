const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
require("./utils/cronjob.js");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const requestRouter = require("./routers/request.js");
const userRouter = require("./routers/user.js");
const paymentRouter = require("./routers/payment.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
console.log("Loaded URI:", process.env.MONGODB_URI);

dbConnect()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection error", err);
  });
