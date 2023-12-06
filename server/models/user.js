const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
  },
  { timestamps: true }
);
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    _.pick(this, ["_id", "name", "email"]),
    config.get("jwtPrivateKey"),
    {
      expiresIn: "7d",
    }
  );
  return token;
};

const Schema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(50).required().email(),
  password: Joi.string().min(3).max(100).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(50).required().email(),
});

const authSchema = Joi.object({
  email: Joi.string().min(3).max(50).required().email(),
  password: Joi.string().min(3).max(100).required(),
});

const validateUser = (user) => {
  return Schema.validate(user);
};

const validateUpdate = (user) => {
  return updateSchema.validate(user);
};

const validateAuth = (user) => {
  return authSchema.validate(user);
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  validateUser,
  validateUpdate,
  validateAuth,
};
