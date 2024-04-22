import { CookieOptions, Router } from "express";
import bcrypt from "bcryptjs";

import { CLIENT_COOKIE_KEY, USER_LEVEL } from "../utils/constants";
import { encrypt, sendError } from "../utils/helpers";
import { createUser, findUserById, findUserByUsername } from "../models/users";

const FALLBACK_MSG =
    "No user found with that username, or username and password don't match";

const cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
};

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
                ...cookieOptions,
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

    const validUsername = username.match(/^[a-z0-9_]{1,20}$/i);
    if (!validUsername) {
        return res.status(401).send({ message: "Invalid username" });
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        const insertQueryResult = await createUser({
            username,
            password_hash: passwordHash,
            user_level: USER_LEVEL.REGULAR_USER,
        });
        const newUser = await findUserById(Number(insertQueryResult.insertId));
        if (!newUser) {
            throw new Error("Something went wrong during user creation");
        }

        const date = new Date();
        date.setDate(date.getDate() + 30);
        res.cookie(CLIENT_COOKIE_KEY, encrypt({ userId: newUser.id }), {
            ...cookieOptions,
            expires: date,
        });
        return res.send({ loggedIn: true });
    } catch (e) {
        return sendError(res, e);
    }
});

authRouter.get("/logout", async (_, res) => {
    res.clearCookie(CLIENT_COOKIE_KEY, { httpOnly: true });
    res.send({ loggedIn: false });
});

export default authRouter;
