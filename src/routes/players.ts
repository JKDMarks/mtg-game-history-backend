import { Router } from "express";

import { createPlayer, findAllPlayers, findOnePlayer } from "../models/players";
import { sendError } from "../utils/helpers";

const playersRouter = Router();

playersRouter.get("/", async (req, res) => {
    const players = await findAllPlayers(req.currentUser.id);

    res.json(players);
});

playersRouter.get("/:playerId", async (req, res) => {
    const playerId = parseInt(req.params.playerId);
    const player = await findOnePlayer({ playerId });
    return res.json(player);
});

playersRouter.post("/", async (req, res) => {
    const { name } = req.body;
    try {
        const insertQueryResult = await createPlayer(name, req.currentUser.id);
        const newPlayer = await findOnePlayer({
            playerId: Number(insertQueryResult.insertId),
            includeDecks: false,
        });
        return res.send(newPlayer);
    } catch (e) {
        return sendError(res, e);
    }
});

export default playersRouter;
