const { getUserSession } = require("../services/auth");

const auth = (req, res, next) => {
  console.log(req.cookies);
  const userUid = req.cookies.userId;
  const user = getUserSession(userUid);
  if (!user)
    return res.status(401).send("Access denied. No valid token provided.");

  req.user = user;
  next();
};

module.exports = {
  auth,
};
