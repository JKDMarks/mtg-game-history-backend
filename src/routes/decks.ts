import { Router } from "express";
import { createDeck, findAllDecks, findOneDeck } from "../models/decks";
import { sendError } from "../utils/helpers";

const decksRouter = Router();

decksRouter.get("/", async (req, res) => {
    const players = await findAllDecks(req.currentUser.id);

    res.json(players);
});

decksRouter.get("/:deckId", async (req, res) => {
    const deckId = parseInt(req.params.deckId);
    const player = await findOneDeck({ deckId });
    return res.json(player);
});

decksRouter.post("/", async (req, res) => {
    const { name, player_id } = req.body;
    try {
        const insertQueryResult = await createDeck(
            name,
            player_id,
            req.currentUser.id
        );
        const newDeck = await findOneDeck({
            deckId: Number(insertQueryResult.insertId),
        });
        return res.send(newDeck);
    } catch (e) {
        return sendError(res, e);
    }
});

export default decksRouter;
