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
const express_1 = require("express");
const games_1 = require("../models/games");
const moment_1 = __importDefault(require("moment"));
const models_1 = __importDefault(require("../models"));
const helpers_1 = require("../utils/helpers");
const players_1 = require("../models/players");
const decks_1 = require("../models/decks");
const gamesRouter = (0, express_1.Router)();
gamesRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const games = yield (0, games_1.findAllGames)({ userId: req.currentUser.id });
    return res.send(games);
}));
gamesRouter.get("/recent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield (0, games_1.findMostRecentGame)(req.currentUser.id);
    return res.send(game !== null && game !== void 0 ? game : {});
}));
gamesRouter.get("/:gameId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = parseInt(req.params.gameId);
    if (!isNaN(gameId)) {
        const game = yield (0, games_1.findOneGame)(gameId);
        return res.send(game !== null && game !== void 0 ? game : {});
    }
    return res.status(404).send({ message: "No game found with that id" });
}));
gamesRouter.get("/player/:playerId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerId = parseInt(req.params.playerId);
    const games = isNaN(playerId)
        ? []
        : yield (0, games_1.findAllGames)({
            userId: req.currentUser.id,
            playerId,
        });
    return res.json(games);
}));
gamesRouter.get("/deck/:deckId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deckId = parseInt(req.params.deckId);
    const games = isNaN(deckId)
        ? []
        : yield (0, games_1.findAllGames)({
            userId: req.currentUser.id,
            deckId,
        });
    return res.json(games);
}));
gamesRouter.post("/:gameId/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
        return res.status(404).json({ message: "Invalid game" });
    }
    const { notes, player_decks } = req.body;
    const game = yield (0, games_1.findOneGame)(Number(gameId));
    if (!game || !game.id || req.currentUser.id !== game.user_id) {
        return res.status(404).json({ message: "Invalid game" });
    }
    try {
        yield models_1.default.transaction().execute((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const uniquePlayers = new Set();
            const uniqueDecks = new Set();
            for (let pd of player_decks) {
                const { player_id, deck_id, is_winner } = pd;
                const player = yield (0, players_1.findOnePlayer)({
                    playerId: player_id,
                    userId: req.currentUser.id,
                    includeDecks: false,
                });
                const deck = yield (0, decks_1.findOneDeck)({
                    deckId: deck_id,
                    userId: req.currentUser.id,
                });
                if (!player) {
                    throw new Error(`Player id ${player_id} does not exist or is not associated with current user`);
                }
                if (!deck) {
                    throw new Error(`Deck id ${deck_id} does not exist or is not associated with current user`);
                }
                yield trx
                    .updateTable("game_player_decks")
                    .set({
                    game_id: gameId,
                    player_id: player.id,
                    deck_id: deck.id,
                    is_winner,
                })
                    .where("game_player_decks.id", "=", pd.id)
                    .execute();
                uniquePlayers.add(player.id);
                uniqueDecks.add(deck.id);
                const values = pd.cards.map((card) => (Object.assign(Object.assign({}, card), { game_player_deck_id: pd.id })));
                yield trx
                    .deleteFrom("cards")
                    .where("cards.game_player_deck_id", "=", pd.id)
                    .execute();
                if (values.length > 0) {
                    yield trx.insertInto("cards").values(values).execute();
                }
            }
            if (uniquePlayers.size < player_decks.length ||
                uniqueDecks.size < player_decks.length) {
                throw new Error("Non-unique players or decks");
            }
            if (notes) {
                yield trx
                    .updateTable("games")
                    .set({ notes })
                    .where("id", "=", gameId)
                    .execute();
            }
        }));
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
    const updatedGame = yield (0, games_1.findOneGame)(gameId);
    return res.json(updatedGame);
}));
gamesRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notes, player_decks, date: _date } = req.body;
    const date = _date !== null && _date !== void 0 ? _date : (0, moment_1.default)().format("YYYY-MM-DD");
    let newGameId = null;
    try {
        yield models_1.default.transaction().execute((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const newGame = yield trx
                .insertInto("games")
                .values({ date, notes, user_id: req.currentUser.id })
                .executeTakeFirstOrThrow();
            newGameId = Number(newGame.insertId);
            const uniquePlayers = new Set();
            const uniqueDecks = new Set();
            for (let pd of player_decks) {
                const { player_id, deck_id, is_winner } = pd;
                const player = yield (0, players_1.findOnePlayer)({
                    playerId: player_id,
                    userId: req.currentUser.id,
                    includeDecks: false,
                });
                const deck = yield (0, decks_1.findOneDeck)({
                    deckId: deck_id,
                    userId: req.currentUser.id,
                });
                if (!player) {
                    throw new Error(`Player id ${player_id} does not exist or is not associated with current user`);
                }
                if (!deck) {
                    throw new Error(`Deck id ${deck_id} does not exist or is not associated with current user`);
                }
                const newGpd = yield trx
                    .insertInto("game_player_decks")
                    .values({
                    game_id: newGameId,
                    player_id: player.id,
                    deck_id: deck.id,
                    is_winner,
                })
                    .executeTakeFirstOrThrow();
                uniquePlayers.add(player_id);
                uniqueDecks.add(deck_id);
                const newGpdId = Number(newGpd.insertId);
                const values = pd.cards.map((card) => (Object.assign(Object.assign({}, card), { game_player_deck_id: newGpdId })));
                if (values.length > 0) {
                    yield trx.insertInto("cards").values(values).execute();
                }
            }
            if (uniquePlayers.size < player_decks.length ||
                uniqueDecks.size < player_decks.length) {
                throw new Error("Non-unique players or decks");
            }
        }));
        if (newGameId) {
            const newGame = yield (0, games_1.findOneGame)(newGameId);
            return res.send(newGame);
        }
        throw new Error("something went wrong");
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
exports.default = gamesRouter;
