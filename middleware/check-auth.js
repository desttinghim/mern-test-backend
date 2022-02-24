const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const secrets = require("../secrets");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      const error = new HttpError("Authentication failed!", 401);
      return next(error);
    }
    const decodedToken = jwt.verify(token, secrets.jwtKey);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
