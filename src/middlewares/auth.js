const adminAuth = (req, res, next) => {
  const token = "abc";
  const login = token === "abc";
  if (login) {
    res.send("Hello admin!");
    next();
  } else {
    res.status(402).send("Unauthorized");
  }
};
const userAuth = (req, res, next) => {
  const token = "abc";
  const login = token === "abc";
  if (login) {
    res.send("Hello user!");
    next();
  } else {
    res.status(402).send("Unauthorized");
  }
};
module.exports = {
  adminAuth,
  userAuth,
};
