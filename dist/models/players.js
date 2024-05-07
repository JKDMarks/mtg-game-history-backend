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
exports.updatePlayer = exports.selectPlayerCount = exports.createPlayer = exports.findOnePlayer = exports.findAllPlayers = void 0;
const _1 = __importDefault(require("."));
const mysql_1 = require("kysely/helpers/mysql");
const withDecks = (eb) => {
    return (0, mysql_1.jsonArrayFrom)(eb
        .selectFrom("decks")
        .select(["decks.id", "decks.name"])
        .whereRef("players.id", "=", "decks.player_id")).as("decks");
};
const findAllPlayers = (currUserId) => __awaiter(void 0, void 0, void 0, function* () {
    let query = _1.default
        .selectFrom("players")
        .selectAll("players")
        .select(withDecks)
        .orderBy("id");
    if (currUserId) {
        query = query.where("user_id", "=", currUserId);
    }
    return yield query.execute();
});
exports.findAllPlayers = findAllPlayers;
const findOnePlayer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ playerId, userId, name, includeDecks = true, }) {
    let query = _1.default.selectFrom("players").selectAll("players");
    if (playerId) {
        query = query.where("id", "=", playerId);
    }
    if (userId) {
        query = query.where("user_id", "=", userId);
    }
    if (name) {
        query = query.where("name", "=", name);
    }
    if (includeDecks) {
        query = query.select(withDecks);
    }
    return yield query.executeTakeFirst();
});
exports.findOnePlayer = findOnePlayer;
const createPlayer = (name, userId) => {
    return _1.default
        .insertInto("players")
        .values({ name, user_id: userId })
        .executeTakeFirst();
};
exports.createPlayer = createPlayer;
const selectPlayerCount = (currUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.default
        .selectFrom("players")
        .select(({ eb }) => eb.fn.count("players.id").as("player_count"))
        .where("user_id", "=", currUserId)
        .executeTakeFirst();
});
exports.selectPlayerCount = selectPlayerCount;
const updatePlayer = (_b) => __awaiter(void 0, [_b], void 0, function* ({ playerId, name, }) {
    let query = _1.default.updateTable("players").where("id", "=", playerId);
    if (name) {
        query = query.set({ name });
    }
    return yield query.executeTakeFirst();
});
exports.updatePlayer = updatePlayer;
