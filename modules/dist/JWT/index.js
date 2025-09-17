"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyJwt = exports.useJWT = exports.generateJwt = exports.checkJWT = exports.arraysContainAllElements = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _fs = _interopRequireDefault(require("fs"));
var _adminsController = _interopRequireDefault(require("../database/controllers/adminsController"));
var _express = require("express");
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _SafeDatabaseTransaction = require("../Util/SafeDatabaseTransaction");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const privateKEY = process.env.PRIVATE_KEY ?? _fs.default.readFileSync("./keys/privatekey.pem", "utf8");
const publicKEY = process.env.PUBLIC_KEY ?? _fs.default.readFileSync("./keys/publickey.pem", "utf8");
if (!privateKEY || !publicKEY) {
  throw 'You need the necessary keys to run this API. Please run the script located at "./scrips/generate_key_pair.sh".';
}
const algorithm = "RS512";
const signOptions = {
  algorithm
};
const verifyOptions = {
  algorithms: [algorithm]
};
const generateJwt = credentials => {
  return _jsonwebtoken.default.sign(_objectSpread(_objectSpread({}, credentials), {}, {
    seed: Math.random().toString()
  }), privateKEY, signOptions);
};
exports.generateJwt = generateJwt;
const verifyJwt = token => {
  return _jsonwebtoken.default.verify(token, publicKEY, verifyOptions);
};
exports.verifyJwt = verifyJwt;
const checkJWT = async (jwt, permissions) => {
  try {
    const {
      userId,
      username
    } = verifyJwt(jwt);
    const adminDataTransaction = await _adminsController.default.getAdmin(userId);
    if (!(0, _SafeDatabaseTransaction.isTransactionSuccessful)(adminDataTransaction)) {
      return false;
    }
    const adminData = adminDataTransaction.data;
    const hasAllPerms = arraysContainAllElements(adminData.permissions, permissions) || adminData.permissions.includes("*");
    if (hasAllPerms) {
      return {
        userId,
        username
      };
    } else {
      return false;
    }
  } catch (e) {
    console.warn(e);
    return false;
  }
};
exports.checkJWT = checkJWT;
const arraysContainAllElements = (A, B) => {
  return B.every(element => A.includes(element));
};
exports.arraysContainAllElements = arraysContainAllElements;
const useJWT = (permissions = []) => {
  const jwtMiddleware = async (req, res, next) => {
    const jwt = req.headers.authorization || req.body.jwt || req.params.jwt || req.cookies.jwt;
    if (!jwt) {
      return res.status(401).send({
        errorType: "Transaction",
        message: "Please login to continue"
      });
    }
    const jwtResult = await checkJWT(jwt, permissions);
    if (jwtResult) {
      req.context.set("userId", jwtResult.userId);
      const newJwt = generateJwt(jwtResult);
      res.cookie("jwt", newJwt, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
        secure: true
      });
      return next();
    } else {
      res.status(403).send({
        errorType: "Transaction",
        message: "Not authorized"
      });
    }
  };
  return [(0, _cookieParser.default)(), (0, _express.json)(), jwtMiddleware];
};
exports.useJWT = useJWT;
//# sourceMappingURL=index.js.map