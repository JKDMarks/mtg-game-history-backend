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
exports.findMostRecentGame = exports.findOneGame = exports.findAllGames = void 0;
const _1 = __importDefault(require("."));
const mysql_1 = require("kysely/helpers/mysql");
const withGPDs = (eb) => {
    return (0, mysql_1.jsonArrayFrom)(eb
        .selectFrom("game_player_decks")
        .select([
        "id",
        "game_player_decks.is_winner",
        withPlayerFromGPD,
        withDeck,
        withCardsFromGPD,
    ])
        .whereRef("games.id", "=", "game_player_decks.game_id")
        .orderBy("id")).as("game_player_decks");
};
const withPlayerFromGPD = (eb) => {
    return (0, mysql_1.jsonObjectFrom)(eb
        .selectFrom("players")
        .select(["players.id", "players.name"])
        .whereRef("players.id", "=", "game_player_decks.player_id")).as("player");
};
const withCardsFromGPD = (eb) => {
    return (0, mysql_1.jsonArrayFrom)(eb
        .selectFrom("cards")
        .select(["cards.name", "cards.turn_played"])
        .whereRef("cards.game_player_deck_id", "=", "game_player_decks.id")).as("cards");
};
const withPlayerFromDeck = (eb) => {
    return (0, mysql_1.jsonObjectFrom)(eb
        .selectFrom("players")
        .select(["players.id", "players.name"])
        .whereRef("players.id", "=", "decks.player_id")).as("player");
};
const withDeck = (eb) => {
    return (0, mysql_1.jsonObjectFrom)(eb
        .selectFrom("decks")
        .select(["decks.id", "decks.name", withPlayerFromDeck])
        .whereRef("decks.id", "=", "game_player_decks.deck_id")).as("deck");
};
const findAllGames = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, playerId, deckId, }) {
    let query = _1.default
        .selectFrom("games")
        .selectAll("games")
        .select(withGPDs)
        .orderBy("id");
    if (userId) {
        query = query.where("games.user_id", "=", userId);
    }
    if (playerId) {
        query = query
            .innerJoin("game_player_decks", "game_player_decks.game_id", "games.id")
            .innerJoin("players", "players.id", "game_player_decks.player_id")
            .where("players.id", "=", playerId);
    }
    if (deckId) {
        query = query
            .innerJoin("game_player_decks", "game_player_decks.game_id", "games.id")
            .innerJoin("decks", "decks.id", "game_player_decks.deck_id")
            .where("decks.id", "=", deckId);
    }
    return yield query.execute();
});
exports.findAllGames = findAllGames;
const findOneGame = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.default
        .selectFrom("games")
        .selectAll("games")
        .select(withGPDs)
        .where("id", "=", gameId)
        .orderBy("id")
        .executeTakeFirst();
});
exports.findOneGame = findOneGame;
const findMostRecentGame = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _1.default
        .selectFrom("games")
        .selectAll("games")
        .select(withGPDs)
        .where("games.user_id", "=", userId)
        .orderBy("id", "desc")
        .executeTakeFirst();
});
exports.findMostRecentGame = findMostRecentGame;
