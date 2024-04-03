import { ExpressionBuilder, Generated } from "kysely";
import db, { Database } from ".";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";

export interface GamesTable {
    id: Generated<number>;
    date: string;
    user_id: number;
    notes: string | null;
}

const withGPDs = (eb: ExpressionBuilder<Database, "games">) => {
    return jsonArrayFrom(
        eb
            .selectFrom("game_player_decks")
            .select([
                "id",
                "game_player_decks.is_winner",
                withPlayerFromGPD,
                withDeck,
            ])
            .whereRef("games.id", "=", "game_player_decks.game_id")
            .orderBy("id")
    ).as("game_player_decks");
};

const withPlayerFromGPD = (
    eb: ExpressionBuilder<Database, "game_player_decks">
) => {
    return jsonObjectFrom(
        eb
            .selectFrom("players")
            .select(["players.id", "players.name"])
            .whereRef("players.id", "=", "game_player_decks.player_id")
    ).as("player");
};

const withPlayerFromDeck = (eb: ExpressionBuilder<Database, "decks">) => {
    return jsonObjectFrom(
        eb
            .selectFrom("players")
            .select(["players.id", "players.name"])
            .whereRef("players.id", "=", "decks.player_id")
    ).as("player");
};

const withDeck = (eb: ExpressionBuilder<Database, "game_player_decks">) => {
    return jsonObjectFrom(
        eb
            .selectFrom("decks")
            .select(["decks.id", "decks.name", withPlayerFromDeck])
            .whereRef("decks.id", "=", "game_player_decks.deck_id")
    ).as("deck");
};

export const findAllGames = async ({
    userId,
    playerId,
    deckId,
}: {
    userId?: number;
    playerId?: number;
    deckId?: number;
}) => {
    let query = db
        .selectFrom("games")
        .selectAll("games")
        .select(withGPDs)
        .orderBy("id");

    if (userId) {
        query = query.where("games.user_id", "=", userId);
    }

    if (playerId) {
        query = query
            .innerJoin(
                "game_player_decks",
                "game_player_decks.game_id",
                "games.id"
            )
            .innerJoin("players", "players.id", "game_player_decks.player_id")
            .where("players.id", "=", playerId);
    }

    if (deckId) {
        query = query
            .innerJoin(
                "game_player_decks",
                "game_player_decks.game_id",
                "games.id"
            )
            .innerJoin("decks", "decks.id", "game_player_decks.deck_id")
            .where("decks.id", "=", deckId);
    }

    return await query.execute();
};

export const findOneGame = async (gameId: number) => {
    return await db
        .selectFrom("games")
        .selectAll("games")
        .select(withGPDs)
        .where("id", "=", gameId)
        .orderBy("id")
        .executeTakeFirst();
};

export const findMostRecentGame = async (userId: number) => {
    return await db
        .selectFrom("games")
        .selectAll("games")
        .select(withGPDs)
        .where("games.user_id", "=", userId)
        .orderBy("id", "desc")
        .executeTakeFirst();
};
