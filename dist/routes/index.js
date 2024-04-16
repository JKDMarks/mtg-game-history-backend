"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.auth = exports.games = exports.players = void 0;
const players_1 = __importDefault(require("./players"));
exports.players = players_1.default;
// import decks from "./decks";
const games_1 = __importDefault(require("./games"));
exports.games = games_1.default;
const auth_1 = __importDefault(require("./auth"));
exports.auth = auth_1.default;
const users_1 = __importDefault(require("./users"));
exports.users = users_1.default;
