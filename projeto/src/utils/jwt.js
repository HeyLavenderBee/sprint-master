const env = require("../config/env");
const jwt = require("jsonwebtoken");

function createToken(payload) {
    return jwt.sign(
    payload,
    env.jwt.secret,
    { expiresIn: env.jwt.expiresInSeconds }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  createToken,
  verifyToken
};