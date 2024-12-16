import { Router } from "express";
import {
    createDeck,
    findAllDecks,
    findOneDeck,
    selectDeckCards,
    selectDeckCount,
    updateDeck,
} from "../models/decks";
import { sendError } from "../utils/helpers";
import { USER_LEVEL } from "../utils/constants";

const decksRouter = Router();

decksRouter.get("/", async (req, res) => {
    const decks = await findAllDecks(req.currentUser.id);

    if (
        typeof req.query.is_archived == "string" &&
        ["0", "false"].includes(req.query.is_archived.toLowerCase())
    ) {
        return res.json(
            decks.filter(
                (d) =>
                    !d.is_archived &&
                    (d.player === null || !d.player.is_archived)
            )
        );
    }

    return res.json(decks);
});

decksRouter.get("/:deckId", async (req, res) => {
    try {
        const deckId = parseInt(req.params.deckId);
        const deck = await findOneDeck({ deckId });
        if (!deck) {
            throw new Error("No deck found");
        }
        const deckCards = await selectDeckCards({ deckId: deck.id });
        return res.json({ ...deck, cards: deckCards });
    } catch (e) {
        return sendError(res, e);
    }
});

decksRouter.post("/", async (req, res) => {
    if (req.currentUser.user_level === USER_LEVEL.RESTRICTED) {
        const queryResult = await selectDeckCount(req.currentUser.id);
        if (queryResult !== undefined && Number(queryResult?.deck_count) >= 4) {
            return res.status(401).json({
                message:
                    "New users cannot create more than 4 decks. Go to your profile page and complete your signup to add more decks.",
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

decksRouter.post("/:deckId/edit", async (req, res) => {
    const deckId = parseInt(req.params.deckId);
    const deck = await findOneDeck({ deckId });

    try {
        if (!deck || deck.user_id !== req.currentUser.id) {
            return res.status(401).json({ message: "Invalid deck id" });
        }
        const queryResult = await updateDeck({
            deckId,
            name: req.body.name,
            is_archived: req.body.is_archived,
        });
        if (Number(queryResult.numUpdatedRows) === 1) {
            const deck = await findOneDeck({ deckId });
            const playerId = deck?.player?.id;
            return res.json({
                success: true,
                redirect: playerId ? `/players/${playerId}` : undefined,
            });
        }
    } catch (e) {
        return sendError(res, e);
    }
});

export default decksRouter;
