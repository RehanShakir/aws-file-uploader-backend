import mongoose from "mongoose";
// const Joi = require("joi");
import jwt from "jsonwebtoken";

let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    // required: true,
  },
  type: {
    type: String,
    default: "user",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWTSECRETKEY);
  return token;
};
let UserModel = new mongoose.model("User", userSchema);

export default UserModel;
// exports.validateUser = validateUser;
