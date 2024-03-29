import { Router } from "express";
import bcrypt from "bcryptjs";

import db from "../models";
import { CLIENT_COOKIE_KEY, USER_LEVEL } from "../utils/constants";
import { encrypt, sendError } from "../utils/helpers";
import { createUser, findUserByUsername } from "../models/users";

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
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
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
    const { name, username, password } = req.body;
    if (
        !username ||
        !password ||
        !name ||
        typeof username !== "string" ||
        typeof name !== "string" ||
        typeof password !== "string"
    ) {
        return res
            .status(401)
            .send({ message: "Missing username, name, or password" });
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        await createUser({
            username,
            password_hash: passwordHash,
            user_level: USER_LEVEL.RESTRICTED,
        });
        const newUser = await findUserByUsername(username);
        if (!newUser) {
            throw new Error("Something went wrong during user creation");
        }

        const date = new Date();
        date.setDate(date.getDate() + 30);
        res.cookie(CLIENT_COOKIE_KEY, encrypt({ userId: newUser.id }), {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
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
