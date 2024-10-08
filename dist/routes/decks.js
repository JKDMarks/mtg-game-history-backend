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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const decks_1 = require("../models/decks");
const helpers_1 = require("../utils/helpers");
const constants_1 = require("../utils/constants");
const decksRouter = (0, express_1.Router)();
decksRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const players = yield (0, decks_1.findAllDecks)(req.currentUser.id);
    res.json(players);
}));
decksRouter.get("/:deckId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deckId = parseInt(req.params.deckId);
        const deck = yield (0, decks_1.findOneDeck)({ deckId });
        if (!deck) {
            throw new Error("No deck found");
        }
        const deckCards = yield (0, decks_1.selectDeckCards)({ deckId: deck.id });
        return res.json(Object.assign(Object.assign({}, deck), { cards: deckCards }));
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
decksRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.currentUser.user_level === constants_1.USER_LEVEL.RESTRICTED) {
        const queryResult = yield (0, decks_1.selectDeckCount)(req.currentUser.id);
        if (queryResult !== undefined && Number(queryResult === null || queryResult === void 0 ? void 0 : queryResult.deck_count) >= 4) {
            return res.status(401).json({
                message: "New users cannot create more than 4 decks. Go to your profile page and complete your signup to add more decks.",
            });
        }
    }
    const { name, player_id } = req.body;
    try {
        const insertQueryResult = yield (0, decks_1.createDeck)(name, player_id, req.currentUser.id);
        const newDeck = yield (0, decks_1.findOneDeck)({
            deckId: Number(insertQueryResult.insertId),
        });
        return res.send(newDeck);
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
decksRouter.post("/:deckId/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deckId = parseInt(req.params.deckId);
    const deck = yield (0, decks_1.findOneDeck)({ deckId });
    try {
        if (!deck || deck.user_id !== req.currentUser.id) {
            return res.status(401).json({ message: "Invalid deck id" });
        }
        const queryResult = yield (0, decks_1.updateDeck)({ deckId, name: req.body.name });
        if (Number(queryResult.numUpdatedRows) === 1) {
            return res.json({ success: true });
        }
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
exports.default = decksRouter;
