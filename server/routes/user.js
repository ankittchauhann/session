const express = require("express");

const router = express.Router();

const {
  registerUser,
  deleteUser,
  updateUser,
  getUsers,
  getUser,
  loginUser,
} = require("../controllers/user");

router.route("/").get(getUsers).post(registerUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
