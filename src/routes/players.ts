import { Router } from "express";

import { findAllPlayers, findOnePlayer } from "../models/players";

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

// playersRouter.post("/", async (req, res) => {
//     const { name } = req.body;
//     try {
//         const newPlayer = await db.Player.create({ name });
//         const safeToSendNewPlayer = await db.Player.findOne({
//             where: { id: newPlayer.id },
//         });
//         return res.send(safeToSendNewPlayer);
//     } catch (e) {
//         return res
//             .status(401)
//             .send({ message: e?.errors?.[0]?.message || e.message });
//     }
// });

export default playersRouter;
