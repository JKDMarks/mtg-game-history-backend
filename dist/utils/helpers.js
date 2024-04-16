"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeaders = exports.disallowRestrictedUsers = exports.checkAuthCookie = exports.sendError = exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const constants_1 = require("./constants");
const users_1 = require("../models/users");
const encrypt = (message) => {
    let stringMessage;
    if (typeof message === "number") {
        stringMessage = message.toString();
    }
    else if (typeof message === "object") {
        stringMessage = JSON.stringify(message);
    }
    else {
        stringMessage = message;
    }
    return crypto_js_1.default.AES.encrypt(stringMessage, process.env.SECRET_KEY).toString();
};
exports.encrypt = encrypt;
const decrypt = (cipher) => {
    const bytes = crypto_js_1.default.AES.decrypt(cipher, process.env.SECRET_KEY);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
};
exports.decrypt = decrypt;
const sendError = (res, e, errorCode = 500) => {
    if (typeof e == "string") {
        return res.status(errorCode).send({ message: e });
    }
    else if (e instanceof Error) {
        return res.status(errorCode).send({ message: e.message });
    }
};
exports.sendError = sendError;
const checkAuthCookie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.url.startsWith("/auth")) {
        try {
            const { [constants_1.CLIENT_COOKIE_KEY]: authCookieValue } = req.cookies;
            if (!authCookieValue) {
                return res.status(403).send({ message: "Not logged in" });
            }
            const decrypted = (0, exports.decrypt)(authCookieValue);
            const { userId } = JSON.parse(decrypted);
            const user = yield (0, users_1.findUserById)(userId);
            if (!user) {
                return res.status(403).send({ message: "Not logged in" });
            }
            req.currentUser = user;
        }
        catch (e) {
            return (0, exports.sendError)(res, e);
        }
    }
    next();
});
exports.checkAuthCookie = checkAuthCookie;
const disallowRestrictedUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.currentUser &&
        req.currentUser.user_level < constants_1.USER_LEVEL.REGULAR_USER &&
        req.method === "POST") {
        return res.status(401).send({ message: "Cannot perform that action" });
    }
    next();
});
exports.disallowRestrictedUsers = disallowRestrictedUsers;
const setHeaders = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Security-Policy", `script-src 'self' ${process.env.BACKEND_URL.split(",").join(" ")}`);
    return next();
});
exports.setHeaders = setHeaders;
