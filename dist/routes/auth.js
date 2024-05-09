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
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../utils/constants");
const helpers_1 = require("../utils/helpers");
const users_1 = require("../models/users");
const FALLBACK_MSG = "No user found with that username, or username and password don't match";
const authRouter = (0, express_1.Router)();
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username ||
            !password ||
            typeof username !== "string" ||
            typeof password !== "string") {
            return res
                .status(401)
                .send({ message: "Missing username or password" });
        }
        const user = yield (0, users_1.findUserByUsername)(username);
        if (!user) {
            return res.status(401).send({
                message: FALLBACK_MSG,
            });
        }
        const doesPasswordMatch = bcryptjs_1.default.compareSync(password, user.password_hash);
        if (doesPasswordMatch) {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            res.cookie(constants_1.CLIENT_COOKIE_KEY, (0, helpers_1.encrypt)({ userId: user.id }), Object.assign(Object.assign({}, constants_1.COOKIE_OPTIONS), { expires: date }));
            return res.send({ loggedIn: true });
        }
        else {
            return res.send({
                loggedIn: false,
                message: "No user found with that username, or username and password don't match",
            });
        }
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, user_level } = req.body;
    if (!username ||
        !password ||
        typeof username !== "string" ||
        typeof password !== "string") {
        return res
            .status(401)
            .send({ message: "Missing username or password" });
    }
    const isValidUsername = username.match(constants_1.USERNAME_RGX);
    if (!isValidUsername) {
        return res.status(401).send({ message: "Invalid username" });
    }
    try {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const passwordHash = bcryptjs_1.default.hashSync(password, salt);
        const insertQueryResult = yield (0, users_1.createUser)({
            username,
            password_hash: passwordHash,
            user_level: user_level !== null && user_level !== void 0 ? user_level : constants_1.USER_LEVEL.REGULAR_USER,
        });
        const newUser = yield (0, users_1.findUserById)(Number(insertQueryResult.insertId));
        if (!newUser) {
            throw new Error("Something went wrong during user creation");
        }
        const date = new Date();
        date.setDate(date.getDate() + 30);
        res.cookie(constants_1.CLIENT_COOKIE_KEY, (0, helpers_1.encrypt)({ userId: newUser.id }), Object.assign(Object.assign({}, constants_1.COOKIE_OPTIONS), { expires: date }));
        return res.send({ loggedIn: true });
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
authRouter.post("/update", (req, res, ___) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        user = yield (0, helpers_1.getUserFromCookiesOrThrow)(req, true);
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
    const { username, password, prev_password } = req.body;
    if (!username && !password) {
        return res.status(400).json({ message: "No updates provided" });
    }
    if (username) {
        const isValidUsername = username.match(constants_1.USERNAME_RGX);
        if (!isValidUsername) {
            return res.status(400).json({ message: "Invalid username" });
        }
    }
    let newPasswordHash;
    if (password && prev_password) {
        const isValidPassword = password.length >= 8;
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const doesPasswordMatch = bcryptjs_1.default.compareSync(prev_password, user.password_hash);
        if (!doesPasswordMatch) {
            return res.status(400).json({
                message: "Entered value doesn't match current password",
            });
        }
        const salt = bcryptjs_1.default.genSaltSync(10);
        newPasswordHash = bcryptjs_1.default.hashSync(password, salt);
    }
    let userLevel;
    if (user.user_level === constants_1.USER_LEVEL.RESTRICTED) {
        if (!password) {
            return res
                .status(400)
                .json({ message: "Provide an updated password" });
        }
        userLevel = constants_1.USER_LEVEL.REGULAR_USER;
    }
    const queryResult = yield (0, users_1.updateUser)({
        userId: user.id,
        username,
        passwordHash: newPasswordHash,
        userLevel,
    });
    if (Number(queryResult.numUpdatedRows) === 1) {
        return res.json({ success: true });
    }
    return res.json({ message: "Update unsuccessful" });
}));
authRouter.get("/logout", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(constants_1.CLIENT_COOKIE_KEY, { httpOnly: true });
    res.send({ loggedIn: false });
}));
exports.default = authRouter;
