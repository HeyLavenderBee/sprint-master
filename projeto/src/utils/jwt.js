const env = require("../config/env");

//const path = require("path");
//const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

/*dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", "..", ".env"),
});*/

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