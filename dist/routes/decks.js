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
const decksRouter = (0, express_1.Router)();
decksRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const players = yield (0, decks_1.findAllDecks)(req.currentUser.id);
    res.json(players);
}));
decksRouter.get("/:deckId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deckId = parseInt(req.params.deckId);
    const player = yield (0, decks_1.findOneDeck)({ deckId });
    return res.json(player);
}));
decksRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = decksRouter;
