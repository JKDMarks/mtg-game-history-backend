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
exports.JONAH_USERNAME = exports.RYAN_USERNAME = exports.PETER_USERNAME = exports.JEFF_USERNAME = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../utils/constants");
exports.JEFF_USERNAME = "jeff";
exports.PETER_USERNAME = "peter";
exports.RYAN_USERNAME = "ryan";
exports.JONAH_USERNAME = "jonah";
const seedUsers = (db) => __awaiter(void 0, void 0, void 0, function* () {
    yield db
        .insertInto("users")
        .values([
        {
            id: 1,
            username: exports.JEFF_USERNAME,
            password_hash: bcryptjs_1.default.hashSync("password1"),
            user_level: constants_1.USER_LEVEL.ADMIN,
        },
        {
            id: 2,
            username: exports.PETER_USERNAME,
            password_hash: bcryptjs_1.default.hashSync("password2"),
            user_level: constants_1.USER_LEVEL.REGULAR_USER,
        },
        {
            id: 3,
            username: exports.RYAN_USERNAME,
            password_hash: bcryptjs_1.default.hashSync("password4"),
            user_level: constants_1.USER_LEVEL.RESTRICTED,
        },
        {
            id: 4,
            username: exports.JONAH_USERNAME,
            password_hash: bcryptjs_1.default.hashSync("password4"),
            user_level: constants_1.USER_LEVEL.BANNED,
        },
    ])
        .execute();
    console.log("Users seeded successfully");
});
exports.default = seedUsers;
