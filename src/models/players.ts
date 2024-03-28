import { ExpressionBuilder, Generated } from "kysely";
import db, { Database } from ".";
import { jsonArrayFrom } from "kysely/helpers/mysql";

export interface PlayersTable {
    id: Generated<number>;
    user_id: number;
    name: string;
}

export const withDecks = (eb: ExpressionBuilder<Database, "players">) =>
    jsonArrayFrom(
        eb
            .selectFrom("decks")
            .select(["decks.id", "decks.name"])
            .whereRef("players.id", "=", "decks.player_id")
    ).as("decks");

export const findAllPlayers = async (currUserId: number) =>
    await db
        .selectFrom("players")
        .where("user_id", "=", currUserId)
        .selectAll("players")
        .select(withDecks)
        .orderBy("id")
        .execute();

export const findOnePlayer = async (currUserId: number, playerId: number) =>
    await db
        .selectFrom("players")
        .where("user_id", "=", currUserId)
        .where("id", "=", playerId)
        .selectAll("players")
        .select(withDecks)
        .executeTakeFirst();
