"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_LEVEL = exports.CLIENT_COOKIE_KEY = void 0;
const CLIENT_COOKIE_KEY = "authToken";
exports.CLIENT_COOKIE_KEY = CLIENT_COOKIE_KEY;
const USER_LEVEL = {
    BANNED: 0,
    RESTRICTED: 1,
    REGULAR_USER: 2,
    ADMIN: 9,
};
exports.USER_LEVEL = USER_LEVEL;
