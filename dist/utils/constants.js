"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERNAME_RGX = exports.COOKIE_OPTIONS = exports.USER_LEVEL = exports.CLIENT_COOKIE_KEY = void 0;
exports.CLIENT_COOKIE_KEY = "authToken";
exports.USER_LEVEL = {
    BANNED: 0,
    RESTRICTED: 2,
    REGULAR_USER: 5,
    ADMIN: 9,
};
exports.COOKIE_OPTIONS = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
};
exports.USERNAME_RGX = /^[a-z0-9_]{1,20}$/i;
