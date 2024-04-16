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
const cookieOptions = {
    secure: true, // process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
};
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
            res.cookie(constants_1.CLIENT_COOKIE_KEY, (0, helpers_1.encrypt)({ userId: user.id }), Object.assign(Object.assign({}, cookieOptions), { expires: date }));
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
    const { username, password } = req.body;
    if (!username ||
        !password ||
        typeof username !== "string" ||
        typeof password !== "string") {
        return res
            .status(401)
            .send({ message: "Missing username or password" });
    }
    const validUsername = username.match(/^[a-z0-9_]{1,20}$/i);
    if (!validUsername) {
        return res.status(401).send({ message: "Invalid username" });
    }
    try {
        const salt = bcryptjs_1.default.genSaltSync(10);
        const passwordHash = bcryptjs_1.default.hashSync(password, salt);
        const insertQueryResult = yield (0, users_1.createUser)({
            username,
            password_hash: passwordHash,
            user_level: constants_1.USER_LEVEL.RESTRICTED,
        });
        const newUser = yield (0, users_1.findUserById)(Number(insertQueryResult.insertId));
        if (!newUser) {
            throw new Error("Something went wrong during user creation");
        }
        const date = new Date();
        date.setDate(date.getDate() + 30);
        res.cookie(constants_1.CLIENT_COOKIE_KEY, (0, helpers_1.encrypt)({ userId: newUser.id }), Object.assign(Object.assign({}, cookieOptions), { expires: date }));
        return res.send({ loggedIn: true });
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
authRouter.get("/logout", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(constants_1.CLIENT_COOKIE_KEY, { httpOnly: true });
    res.send({ loggedIn: false });
}));
exports.default = authRouter;
