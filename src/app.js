const express = require("express");
const app = express();
app.get("/users", (req, res) => {
  res.send({ firstName: "varun", lastName: "bhat" });
});
//this will match all http method API calls
app.use("/", (req, res) => {
  res.send("Hello, World!");
}); //it will respond with "Hello, World!" for any request if its in the top level
app.use("/test", (req, res) => {
  res.send("Hello test!");
}); // it will respond with "Hello test!" for any request to /test
//order matters, so if you put the /test route before the root route, it will respond with "Hello test!" for any request to /test and not reach the root route.

app.use(
  "/",
  (req, res, next) => {
    console.log("Initial middleware");
    next();
  },
  (req, res, next) => {
    console.log("Second middleware");
    next(); // Call next to pass control to the next middleware
    // Call next to pass control to the next middleware
  }
);
app.get("user", (req, res) => {
  comsole.log("request handler for /user");
  res.send("Hello user!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
