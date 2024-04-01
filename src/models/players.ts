import { ExpressionBuilder, Generated } from "kysely";
import db, { Database } from ".";
import { jsonArrayFrom } from "kysely/helpers/mysql";

export interface PlayersTable {
    id: Generated<number>;
    user_id: number;
    name: string;
}

const withDecks = (eb: ExpressionBuilder<Database, "players">) => {
    return jsonArrayFrom(
        eb
            .selectFrom("decks")
            .select(["decks.id", "decks.name"])
            .whereRef("players.id", "=", "decks.player_id")
    ).as("decks");
};

export const findAllPlayers = async (currUserId?: number) => {
    let query = db
        .selectFrom("players")
        .selectAll("players")
        .select(withDecks)
        .orderBy("id");

    if (currUserId) {
        query = query.where("user_id", "=", currUserId);
    }

    return await query.execute();
};

export const findOnePlayer = async ({
    playerId,
    userId,
    includeDecks = true,
}: {
    playerId?: number;
    userId?: number;
    includeDecks?: boolean;
}) => {
    let query = db.selectFrom("players").selectAll("players");

    if (playerId) {
        query = query.where("id", "=", playerId);
    }

    if (userId) {
        query = query.where("user_id", "=", userId);
    }

    if (includeDecks) {
        query = query.select(withDecks);
    }

    return await query.executeTakeFirst();
};
