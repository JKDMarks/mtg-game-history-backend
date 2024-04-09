import CryptoJS from "crypto-js";

import { CLIENT_COOKIE_KEY, USER_LEVEL } from "./constants";
import { NextFunction, Request, Response } from "express";
import { findUserById } from "../models/users";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";

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

export const checkAuthCookie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.url.startsWith("/auth")) {
        try {
            const { [CLIENT_COOKIE_KEY]: authCookieValue } = req.cookies;
            if (!authCookieValue) {
                return res.status(403).send({ message: "Not logged in" });
            }

            const decrypted = decrypt(authCookieValue);
            const { userId } = JSON.parse(decrypted);
            const user = await findUserById(userId);
            if (!user) {
                return res.status(403).send({ message: "Not logged in" });
            }
            req.currentUser = user;
        } catch (e) {
            return sendError(res, e);
        }
    }
    next();
};

export const disallowRestrictedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        req.currentUser &&
        req.currentUser.user_level < USER_LEVEL.REGULAR_USER &&
        req.method === "POST"
    ) {
        return res.status(401).send({ message: "Cannot perform that action" });
    }
    next();
};

export const setHeaders = async (_: Request, res: Response, next: Next) => {
    res.setHeader(
        "Content-Security-Policy",
        `script-src 'self' ${process.env.BACKEND_URL.split(",").join(" ")}`
    );
    return next();
};
