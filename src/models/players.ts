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
    name,
    includeDecks = true,
}: {
    playerId?: number;
    userId?: number;
    name?: string;
    includeDecks?: boolean;
}) => {
    let query = db.selectFrom("players").selectAll("players");

    if (playerId) {
        query = query.where("id", "=", playerId);
    }

    if (userId) {
        query = query.where("user_id", "=", userId);
    }

    if (name) {
        query = query.where("name", "=", name);
    }

    if (includeDecks) {
        query = query.select(withDecks);
    }

    return await query.executeTakeFirst();
};

export const createPlayer = (name: string, userId: number) => {
    return db
        .insertInto("players")
        .values({ name, user_id: userId })
        .executeTakeFirst();
};
