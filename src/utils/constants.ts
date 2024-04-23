import { CookieOptions } from "express";

export const CLIENT_COOKIE_KEY = "authToken";

export const USER_LEVEL = {
    BANNED: 0,
    RESTRICTED: 2,
    REGULAR_USER: 5,
    ADMIN: 9,
};

export const COOKIE_OPTIONS: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
};

export const USERNAME_RGX = /^[a-z0-9_]{1,20}$/i;
