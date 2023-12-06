const express = require("express");
const user = require("./user");
const login = require("./auth");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.use("/auth", login);
router.use("/user", auth, user);

module.exports = router;
