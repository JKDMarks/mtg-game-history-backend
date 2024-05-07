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
exports.updateDeck = exports.selectDeckCount = exports.createDeck = exports.findAllDecks = exports.findOneDeck = void 0;
const _1 = __importDefault(require("."));
const mysql_1 = require("kysely/helpers/mysql");
const withPlayer = (eb) => {
    return (0, mysql_1.jsonObjectFrom)(eb
        .selectFrom("players")
        .select(["id", "name"])
        .whereRef("decks.player_id", "=", "players.id")).as("player");
};
const findOneDeck = (_a) => __awaiter(void 0, [_a], void 0, function* ({ deckId, userId, }) {
    let query = _1.default
        .selectFrom("decks")
        .select(["id", "user_id", "name"])
        .select(withPlayer)
        .where("decks.id", "=", deckId);
    if (userId) {
        query = query.where("decks.user_id", "=", userId);
    }
    return yield query.executeTakeFirst();
});
exports.findOneDeck = findOneDeck;
const findAllDecks = (currUserId) => __awaiter(void 0, void 0, void 0, function* () {
    let query = _1.default
        .selectFrom("decks")
        .select(["id", "user_id", "name"])
        .select(withPlayer)
        .orderBy("id");
    if (currUserId) {
        query = query.where("user_id", "=", currUserId);
    }
    return yield query.execute();
});
exports.findAllDecks = findAllDecks;
const createDeck = (name, player_id, user_id) => {
    return _1.default
        .insertInto("decks")
        .values({ name, player_id, user_id })
        .executeTakeFirst();
};
exports.createDeck = createDeck;
const selectDeckCount = (currUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.default
        .selectFrom("decks")
        .select(({ eb }) => eb.fn.count("decks.id").as("deck_count"))
        .where("user_id", "=", currUserId)
        .executeTakeFirst();
});
exports.selectDeckCount = selectDeckCount;
const updateDeck = (_b) => __awaiter(void 0, [_b], void 0, function* ({ deckId, name, }) {
    let query = _1.default.updateTable("decks").where("id", "=", deckId);
    if (name) {
        query = query.set({ name });
    }
    return yield query.executeTakeFirst();
});
exports.updateDeck = updateDeck;
