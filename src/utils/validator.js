const validatorPackage = require("validator");
const validator = (request) => {
  const { firstName, lastName, emailId, password } = request.body;
  if (!firstName || !lastName) {
    throw new Error("First name and Last name are required");
  }
  if (!validatorPackage.isEmail(emailId)) {
    throw new Error("Invalid Email");
  }
  if (!validatorPackage.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
  //return { firstName, lastName, emailId, password };
};
module.exports = {
  validator,
};
