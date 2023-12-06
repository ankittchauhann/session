const {
  User,
  validateUser,
  validateUpdate,
  validateAuth,
} = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { setUserSession, getUserSession } = require("../services/auth");

const registerUser = async (req, res) => {
  // Validate the request body
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("That user already exisits!");

  // Insert the new user if they do not exist yet
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // Send the response back
  res.send(_.pick(user, ["_id", "name", "email", "createdAt", "updatedAt"]));
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(
      _.pick(user, ["_id", "name", "email", "createdAt", "updatedAt", "__v"])
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUser = async (req, res) => {
  // Validate the request body
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true }
    );
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(_.pick(user, ["_id", "name", "email", "createdAt", "updatedAt"]));
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(_.pick(user, ["_id", "name", "email", "createdAt", "updatedAt"]));
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const loginUser = async (req, res) => {
  // Validate the request body
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Incorrect email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Incorrect email or password.");

  // const token = user.generateAuthToken();
  // res.send(token);
  const sessionId = uuidv4();
  setUserSession(sessionId, user);

  res.cookie("userId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60, // 7 days
  });
  res.status(200).send(_.pick(user, ["_id", "name", "email"]));
};

module.exports = {
  registerUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
  loginUser,
};
