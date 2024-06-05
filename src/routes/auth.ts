import { Router } from "express";
import bcrypt from "bcryptjs";

import {
    CLIENT_COOKIE_KEY,
    COOKIE_OPTIONS,
    USER_LEVEL,
    USERNAME_RGX,
} from "../utils/constants";
import {
    encrypt,
    getUserFromCookiesOrThrow,
    sendError,
} from "../utils/helpers";
import {
    createUser,
    findUserById,
    findUserByUsername,
    updateUser,
} from "../models/users";

const FALLBACK_MSG =
    "No user found with that username, or username and password don't match";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (
            !username ||
            !password ||
            typeof username !== "string" ||
            typeof password !== "string"
        ) {
            return res
                .status(401)
                .send({ message: "Missing username or password" });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).send({
                message: FALLBACK_MSG,
            });
        }
        const doesPasswordMatch = bcrypt.compareSync(
            password,
            user.password_hash
        );
        if (doesPasswordMatch) {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            res.cookie(CLIENT_COOKIE_KEY, encrypt({ userId: user.id }), {
                ...COOKIE_OPTIONS,
                expires: date,
            });
            return res.send({ loggedIn: true });
        } else {
            return res.send({
                loggedIn: false,
                message:
                    "No user found with that username, or username and password don't match",
            });
        }
    } catch (e) {
        return sendError(res, e);
    }
});

authRouter.post("/signup", async (req, res) => {
    const { username, password, user_level } = req.body;
    if (
        !username ||
        !password ||
        typeof username !== "string" ||
        typeof password !== "string"
    ) {
        return res
            .status(401)
            .send({ message: "Missing username or password" });
    }

    const isValidUsername = username.match(USERNAME_RGX);
    if (!isValidUsername) {
        return res.status(401).send({ message: "Invalid username" });
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        const insertQueryResult = await createUser({
            username,
            password_hash: passwordHash,
            user_level: user_level ?? USER_LEVEL.REGULAR_USER,
        });
        const newUser = await findUserById(Number(insertQueryResult.insertId));
        if (!newUser) {
            throw new Error("Something went wrong during user creation");
        }

        const date = new Date();
        date.setDate(date.getDate() + 30);
        res.cookie(CLIENT_COOKIE_KEY, encrypt({ userId: newUser.id }), {
            ...COOKIE_OPTIONS,
            expires: date,
        });
        return res.send({ loggedIn: true });
    } catch (e) {
        return sendError(res, e);
    }
});

authRouter.post("/update", async (req, res, ___) => {
    let user;
    try {
        user = await getUserFromCookiesOrThrow(req, true);
    } catch (e) {
        return sendError(res, e);
    }
    const { username, password, prev_password } = req.body;

    if (!username && !password) {
        return res.status(400).json({ message: "No updates provided" });
    }

    if (username) {
        const isValidUsername = username.match(USERNAME_RGX);
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
        const doesPasswordMatch = bcrypt.compareSync(
            prev_password,
            user.password_hash
        );
        if (!doesPasswordMatch) {
            return res.status(400).json({
                message: "Entered value doesn't match current password",
            });
        }
        const salt = bcrypt.genSaltSync(10);
        newPasswordHash = bcrypt.hashSync(password, salt);
    }

    let userLevel;
    if (user.user_level === USER_LEVEL.RESTRICTED) {
        if (!password) {
            return res
                .status(400)
                .json({ message: "Provide an updated password" });
        }
        userLevel = USER_LEVEL.REGULAR_USER;
    }

    const queryResult = await updateUser({
        userId: user.id,
        username,
        passwordHash: newPasswordHash,
        userLevel,
    });
    if (Number(queryResult.numUpdatedRows) === 1) {
        return res.json({ success: true });
    }

    return res.json({ message: "Update unsuccessful" });
});

authRouter.get("/logout", async (_, res) => {
    res.clearCookie(CLIENT_COOKIE_KEY, { ...COOKIE_OPTIONS });
    res.send({ loggedIn: false });
});

export default authRouter;
