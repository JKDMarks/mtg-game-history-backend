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
exports.makeRandomUsername = exports.setHeaders = exports.checkAuthCookie = exports.getUserFromCookiesOrThrow = exports.autoSignupOnPostReq = exports.sendError = exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
const autoSignupOnPostReq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "POST") {
        try {
            const { [constants_1.CLIENT_COOKIE_KEY]: authCookieValue } = req.cookies;
            if (!authCookieValue) {
                const salt = bcryptjs_1.default.genSaltSync(10);
                const passwordHash = bcryptjs_1.default.hashSync("password", salt);
                const username = yield (0, exports.makeRandomUsername)();
                const insertQueryResult = yield (0, users_1.createUser)({
                    username,
                    password_hash: passwordHash,
                    user_level: constants_1.USER_LEVEL.RESTRICTED,
                });
                const newUserId = Number(insertQueryResult.insertId);
                const user = yield (0, users_1.findUserById)(newUserId);
                const date = new Date();
                date.setDate(date.getDate() + 30);
                res.cookie(constants_1.CLIENT_COOKIE_KEY, (0, exports.encrypt)({ userId: newUserId }), Object.assign(Object.assign({}, constants_1.COOKIE_OPTIONS), { expires: date }));
                req.currentUser = user;
            }
        }
        catch (e) {
            return (0, exports.sendError)(res, e);
        }
    }
    return next();
});
exports.autoSignupOnPostReq = autoSignupOnPostReq;
const getUserFromCookiesOrThrow = (req_1, ...args_1) => __awaiter(void 0, [req_1, ...args_1], void 0, function* (req, includePassword = false) {
    const { [constants_1.CLIENT_COOKIE_KEY]: authCookieValue } = req.cookies;
    if (!authCookieValue) {
        throw new Error("Not logged in");
    }
    const decrypted = (0, exports.decrypt)(authCookieValue);
    const { userId } = JSON.parse(decrypted);
    const user = yield (0, users_1.findUserById)(userId, includePassword);
    if (!user) {
        throw new Error("Not logged in");
    }
    return user;
});
exports.getUserFromCookiesOrThrow = getUserFromCookiesOrThrow;
const checkAuthCookie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.currentUser) {
        return next();
    }
    if (!req.url.startsWith("/auth")) {
        try {
            req.currentUser = yield (0, exports.getUserFromCookiesOrThrow)(req);
        }
        catch (e) {
            return (0, exports.sendError)(res, e);
        }
    }
    return next();
});
exports.checkAuthCookie = checkAuthCookie;
const setHeaders = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader("Content-Security-Policy", `script-src 'self' ${process.env.BACKEND_URL.split(",").join(" ")}`);
    return next();
});
exports.setHeaders = setHeaders;
// export const disallowRestrictedUsers = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     if (
//         req.currentUser &&
//         req.currentUser.user_level < USER_LEVEL.REGULAR_USER &&
//         req.method === "POST"
//     ) {
//         return res.status(401).send({ message: "Cannot perform that action" });
//     }
//     next();
// };
const getRandomDigit = () => {
    return Math.floor(Math.random() * 9);
};
const getXRandomDigitString = (x) => {
    return Object.keys(Array(x).fill(1)).reduce((acc) => acc + getRandomDigit().toString(), "");
};
const makeRandomUsername = () => __awaiter(void 0, void 0, void 0, function* () {
    const scryfallResp = yield fetch("https://api.scryfall.com/cards/random?q=is%3Acommander+name%3A%2F[\\w\\s]%2B%2C%2F+f%3Aedh");
    const randomCommander = yield scryfallResp.json();
    const name = randomCommander.name.split(",")[0].replace(/[\s-]/g, "").toLowerCase() +
        getXRandomDigitString(5);
    return name;
});
exports.makeRandomUsername = makeRandomUsername;
