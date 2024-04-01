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
            .select(["game_player_decks.is_winner", withPlayer, withDeck])
            .whereRef("games.id", "=", "game_player_decks.game_id")
    ).as("game_player_decks");
};

const withPlayer = (eb: ExpressionBuilder<Database, "game_player_decks">) => {
    return jsonObjectFrom(
        eb
            .selectFrom("players")
            .select(["players.id", "players.name"])
            .whereRef("players.id", "=", "game_player_decks.player_id")
    ).as("player");
};

const withDeck = (eb: ExpressionBuilder<Database, "game_player_decks">) => {
    return jsonObjectFrom(
        eb
            .selectFrom("decks")
            .select(["decks.id", "decks.name"])
            .whereRef("decks.id", "=", "game_player_decks.deck_id")
    ).as("deck");
};

export const findAllGames = async (userId?: number) => {
    let query = db
        .selectFrom("games")
        .selectAll("games")
        .select(withGPDs)
        .orderBy("id");

    if (userId) {
        query = query.where("user_id", "=", userId);
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
