import { Router } from "express";
import {
    findAllGames,
    findMostRecentGame,
    findOneGame,
    selectGameCount,
} from "../models/games";
import moment from "moment";
import db from "../models";
import { sendError } from "../utils/helpers";
import { findOnePlayer } from "../models/players";
import { findOneDeck } from "../models/decks";
import { USER_LEVEL } from "../utils/constants";

const gamesRouter = Router();

gamesRouter.get("/", async (req, res) => {
    const games = await findAllGames({ userId: req.currentUser.id });

    return res.send(games);
});

gamesRouter.get("/recent", async (req, res) => {
    const game = await findMostRecentGame(req.currentUser.id);

    return res.send(game ?? {});
});

gamesRouter.get("/:gameId", async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    if (!isNaN(gameId)) {
        const game = await findOneGame(gameId);
        return res.send(game ?? {});
    }

    return res.status(404).send({ message: "No game found with that id" });
});

gamesRouter.get("/player/:playerId", async (req, res) => {
    const playerId = parseInt(req.params.playerId);
    const games = isNaN(playerId)
        ? []
        : await findAllGames({
              userId: req.currentUser.id,
              playerId,
          });
    return res.json(games);
});

gamesRouter.get("/deck/:deckId", async (req, res) => {
    const deckId = parseInt(req.params.deckId);
    const games = isNaN(deckId)
        ? []
        : await findAllGames({
              userId: req.currentUser.id,
              deckId,
          });
    return res.json(games);
});

gamesRouter.post("/:gameId/edit", async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
        return res.status(404).json({ message: "Invalid game" });
    }

    const { notes, player_decks } = req.body;
    const game = await findOneGame(Number(gameId));
    if (!game || !game.id || req.currentUser.id !== game.user_id) {
        return res.status(404).json({ message: "Invalid game" });
    }

    try {
        await db.transaction().execute(async (trx) => {
            const uniquePlayers = new Set();
            const uniqueDecks = new Set();
            for (let pd of player_decks) {
                const {
                    player_id,
                    deck_id,
                    is_winner,
                    mulligan_count,
                    first_player,
                } = pd;
                const player = await findOnePlayer({
                    playerId: player_id,
                    userId: req.currentUser.id,
                    includeDecks: false,
                });
                const deck = await findOneDeck({
                    deckId: deck_id,
                    userId: req.currentUser.id,
                });
                if (!player) {
                    throw new Error(
                        `Player id ${player_id} does not exist or is not associated with current user`
                    );
                }
                if (!deck) {
                    throw new Error(
                        `Deck id ${deck_id} does not exist or is not associated with current user`
                    );
                }
                await trx
                    .updateTable("game_player_decks")
                    .set({
                        game_id: gameId,
                        player_id: player.id,
                        deck_id: deck.id,
                        is_winner,
                        mulligan_count,
                        first_player,
                    })
                    .where("game_player_decks.id", "=", pd.id)
                    .execute();
                uniquePlayers.add(player.id);
                uniqueDecks.add(deck.id);

                const values = pd.cards.map((card: any) => ({
                    ...card,
                    game_player_deck_id: pd.id,
                }));
                await trx
                    .deleteFrom("cards")
                    .where("cards.game_player_deck_id", "=", pd.id)
                    .execute();
                if (values.length > 0) {
                    await trx.insertInto("cards").values(values).execute();
                }
            }
            if (
                uniquePlayers.size < player_decks.length ||
                uniqueDecks.size < player_decks.length
            ) {
                throw new Error("Non-unique players or decks");
            }
            if (notes !== null) {
                await trx
                    .updateTable("games")
                    .set({ notes })
                    .where("id", "=", gameId)
                    .execute();
            }
        });
    } catch (e: unknown) {
        console.log("***error", e);
        return sendError(res, e);
    }

    const updatedGame = await findOneGame(gameId);
    return res.json(updatedGame);
});

gamesRouter.post("/", async (req, res) => {
    if (req.currentUser.user_level === USER_LEVEL.RESTRICTED) {
        const queryResult = await selectGameCount(req.currentUser.id);
        if (queryResult !== undefined && Number(queryResult?.game_count) >= 2) {
            return res.status(401).json({
                message:
                    "New users cannot create more than 2 games. Go to your profile page and complete your signup to add more games.",
            });
        }
    }

    const { notes, player_decks, date: _date } = req.body;
    const date = _date ?? moment().format("YYYY-MM-DD");
    let newGameId = null;

    try {
        await db.transaction().execute(async (trx) => {
            const newGame = await trx
                .insertInto("games")
                .values({ date, notes, user_id: req.currentUser.id })
                .executeTakeFirstOrThrow();

            newGameId = Number(newGame.insertId);

            const uniquePlayers = new Set();
            const uniqueDecks = new Set();
            for (let pd of player_decks) {
                const {
                    player_id,
                    deck_id,
                    is_winner,
                    mulligan_count,
                    first_player,
                } = pd;
                const player = await findOnePlayer({
                    playerId: player_id,
                    userId: req.currentUser.id,
                    includeDecks: false,
                });
                const deck = await findOneDeck({
                    deckId: deck_id,
                    userId: req.currentUser.id,
                });
                if (!player) {
                    throw new Error(
                        `Player id ${player_id} does not exist or is not associated with current user`
                    );
                }
                if (!deck) {
                    throw new Error(
                        `Deck id ${deck_id} does not exist or is not associated with current user`
                    );
                }
                const newGpd = await trx
                    .insertInto("game_player_decks")
                    .values({
                        game_id: newGameId,
                        player_id: player.id,
                        deck_id: deck.id,
                        is_winner,
                        mulligan_count,
                        first_player,
                    })
                    .executeTakeFirstOrThrow();
                uniquePlayers.add(player_id);
                uniqueDecks.add(deck_id);

                const newGpdId = Number(newGpd.insertId);
                const values = pd.cards.map((card: any) => ({
                    ...card,
                    game_player_deck_id: newGpdId,
                }));
                if (values.length > 0) {
                    await trx.insertInto("cards").values(values).execute();
                }
            }
            if (
                uniquePlayers.size < player_decks.length ||
                uniqueDecks.size < player_decks.length
            ) {
                throw new Error("Non-unique players or decks");
            }
        });
        if (newGameId) {
            const newGame = await findOneGame(newGameId);
            return res.send(newGame);
        }
        throw new Error("something went wrong");
    } catch (e) {
        return sendError(res, e);
    }
});

export default gamesRouter;
