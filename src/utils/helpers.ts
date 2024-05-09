import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

import { CLIENT_COOKIE_KEY, COOKIE_OPTIONS, USER_LEVEL } from "./constants";
import { Request, RequestHandler, Response } from "express";
import { createUser, findUserById } from "../models/users";

export const encrypt = (message: string | number | object) => {
    let stringMessage;
    if (typeof message === "number") {
        stringMessage = message.toString();
    } else if (typeof message === "object") {
        stringMessage = JSON.stringify(message);
    } else {
        stringMessage = message;
    }
    return CryptoJS.AES.encrypt(
        stringMessage,
        process.env.SECRET_KEY
    ).toString();
};

export const decrypt = (cipher: string) => {
    const bytes = CryptoJS.AES.decrypt(cipher, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const sendError = (
    res: Response,
    e: unknown,
    errorCode: number = 500
) => {
    if (typeof e == "string") {
        return res.status(errorCode).send({ message: e });
    } else if (e instanceof Error) {
        return res.status(errorCode).send({ message: e.message });
    }
};

export const autoSignupOnPostReq: RequestHandler = async (req, res, next) => {
    if (req.method === "POST" && !req.path.startsWith("/auth")) {
        try {
            const { [CLIENT_COOKIE_KEY]: authCookieValue } = req.cookies;
            if (!authCookieValue) {
                const salt = bcrypt.genSaltSync(10);
                const passwordHash = bcrypt.hashSync("password", salt);
                const username = await makeRandomUsername();
                const insertQueryResult = await createUser({
                    username,
                    password_hash: passwordHash,
                    user_level: USER_LEVEL.RESTRICTED,
                });
                const newUserId = Number(insertQueryResult.insertId);
                const user = await findUserById(newUserId);
                const date = new Date();
                date.setDate(date.getDate() + 30);
                res.cookie(CLIENT_COOKIE_KEY, encrypt({ userId: newUserId }), {
                    ...COOKIE_OPTIONS,
                    expires: date,
                });
                req.currentUser = user;
            }
        } catch (e) {
            return sendError(res, e);
        }
    }
    return next();
};

export const getUserFromCookiesOrThrow = async (
    req: Request,
    includePassword: boolean = false
) => {
    const { [CLIENT_COOKIE_KEY]: authCookieValue } = req.cookies;
    if (!authCookieValue) {
        throw new Error("Not logged in");
    }

    const decrypted = decrypt(authCookieValue);
    const { userId } = JSON.parse(decrypted);
    const user = await findUserById(userId, includePassword);
    if (!user) {
        throw new Error("Not logged in");
    }
    return user;
};

export const checkAuthCookie: RequestHandler = async (req, res, next) => {
    if (req.currentUser) {
        return next();
    }

    if (!req.url.startsWith("/auth")) {
        try {
            req.currentUser = await getUserFromCookiesOrThrow(req);
        } catch (e) {
            return sendError(res, e);
        }
    }
    return next();
};

export const setHeaders: RequestHandler = async (_, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        `script-src 'self' ${process.env.BACKEND_URL.split(",").join(" ")}`
    );
    return next();
};

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

const getXRandomDigitString = (x: number) => {
    return Object.keys(Array(x).fill(1)).reduce(
        (acc) => acc + getRandomDigit().toString(),
        ""
    );
};

export const makeRandomUsername = async () => {
    const scryfallResp = await fetch(
        "https://api.scryfall.com/cards/random?q=is%3Acommander+name%3A%2F[\\w\\s]%2B%2C%2F+f%3Aedh"
    );
    const randomCommander = await scryfallResp.json();
    const name =
        randomCommander.name.split(",")[0].replace(/[\s-]/g, "").toLowerCase() +
        getXRandomDigitString(5);
    return name;
};
