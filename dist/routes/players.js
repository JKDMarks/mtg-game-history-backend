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
const players_1 = require("../models/players");
const helpers_1 = require("../utils/helpers");
const constants_1 = require("../utils/constants");
const playersRouter = (0, express_1.Router)();
playersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const players = yield (0, players_1.findAllPlayers)(req.currentUser.id);
    res.json(players);
}));
playersRouter.get("/:playerId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerId = parseInt(req.params.playerId);
    const player = yield (0, players_1.findOnePlayer)({ playerId });
    return res.json(player);
}));
playersRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.currentUser.user_level === constants_1.USER_LEVEL.RESTRICTED) {
        const queryResult = yield (0, players_1.selectPlayerCount)(req.currentUser.id);
        if (queryResult !== undefined &&
            Number(queryResult === null || queryResult === void 0 ? void 0 : queryResult.player_count) >= 4) {
            return res.status(401).json({
                message: "New users cannot create more than 4 players",
            });
        }
    }
    const { name } = req.body;
    try {
        const insertQueryResult = yield (0, players_1.createPlayer)(name, req.currentUser.id);
        const newPlayer = yield (0, players_1.findOnePlayer)({
            playerId: Number(insertQueryResult.insertId),
            includeDecks: false,
        });
        return res.send(newPlayer);
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
playersRouter.post("/:playerId/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playerId = parseInt(req.params.playerId);
    const player = yield (0, players_1.findOnePlayer)({ playerId });
    try {
        if (!player || player.user_id !== req.currentUser.id) {
            return res.status(401).json({ message: "Invalid player id" });
        }
        const queryResult = yield (0, players_1.updatePlayer)({
            playerId,
            name: req.body.name,
        });
        if (Number(queryResult.numUpdatedRows) === 1) {
            return res.json({ success: true });
        }
    }
    catch (e) {
        return (0, helpers_1.sendError)(res, e);
    }
}));
exports.default = playersRouter;
