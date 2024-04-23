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
exports.updateUser = exports.createUser = exports.findUserByUsername = exports.findUserById = exports.nonsensitiveUserColumns = void 0;
const _1 = __importDefault(require("."));
exports.nonsensitiveUserColumns = [
    "id",
    "username",
    "user_level",
];
const findUserById = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, includePassword = false) {
    if (includePassword) {
        return _1.default
            .selectFrom("users")
            .selectAll("users")
            .where("id", "=", id)
            .executeTakeFirst();
    }
    else {
        return _1.default
            .selectFrom("users")
            .select(exports.nonsensitiveUserColumns)
            .where("id", "=", id)
            .executeTakeFirst();
    }
});
exports.findUserById = findUserById;
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.default
        .selectFrom("users")
        .selectAll("users")
        .where("username", "=", username)
        .executeTakeFirst();
});
exports.findUserByUsername = findUserByUsername;
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ username, password_hash, user_level, }) {
    return yield _1.default
        .insertInto("users")
        .values({ username, password_hash, user_level })
        .executeTakeFirst();
});
exports.createUser = createUser;
const updateUser = (_b) => __awaiter(void 0, [_b], void 0, function* ({ userId, username, passwordHash, userLevel, }) {
    let query = _1.default.updateTable("users").where("id", "=", userId);
    if (username) {
        query = query.set({ username });
    }
    if (passwordHash) {
        query = query.set({ password_hash: passwordHash });
    }
    if (userLevel) {
        query = query.set({ user_level: userLevel });
    }
    return yield query.executeTakeFirst();
});
exports.updateUser = updateUser;
