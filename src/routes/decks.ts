import { Router } from "express";
import {
    createDeck,
    findAllDecks,
    findOneDeck,
    selectDeckCount,
} from "../models/decks";
import { sendError } from "../utils/helpers";
import { USER_LEVEL } from "../utils/constants";

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
    if (req.currentUser.user_level === USER_LEVEL.RESTRICTED) {
        const queryResult = await selectDeckCount(req.currentUser.id);
        if (queryResult !== undefined && Number(queryResult?.deck_count) >= 4) {
            return res.status(401).json({
                message:
                    "New users cannot create more than 4 decks. Please go to your profile page and complete your signup to add more decks.",
            });
        }
    }

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
