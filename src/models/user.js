const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
      validate: {
        validator: async function (value) {
          const user = await mongoose.models.User.findOne({ emailId: value });
          return !user;
        },
        message: "Email already exists",
      },
    },

    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw new Error();
          //validation to check if data entered is either of them
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXp3DxP80ArpRzsB0XWBG9Ow5GeuefbLrUHw&s",
      validate(value) {
        if (validator.isURL(value) === false) {
          throw new Error("Invalid URL");
        }
      },
    },
    description: {
      type: String,
      default: "No description available",
    },
    skills: {
      type: [String],
      validate(value) {
        // if field not modified / not provided in request, skip validation
        if (!this.isModified("skills")) return;

        if (!value || value.length < 3) {
          throw new Error("Atleast 3 skills required");
        }
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
userSchema.methods.getjWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Varun@123", {
    expiresIn: "1h",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordSentByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordMatch = await bcrypt.compare(
    passwordSentByUser,
    passwordHash
  );
  return isPasswordMatch;
};
module.exports = mongoose.model("User", userSchema);
