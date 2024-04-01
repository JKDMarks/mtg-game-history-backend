import { Generated } from "kysely";
import db from ".";

export interface DecksTable {
    id: Generated<number>;
    player_id: number;
    name: string;
}

export const findOneDeck = async ({
    deckId,
    userId,
}: {
    deckId: number;
    userId?: number;
}) => {
    let query = db
        .selectFrom("decks")
        .selectAll("decks")
        .where("decks.id", "=", deckId);

    if (userId) {
        query = query
            .innerJoin("players", "players.id", "decks.player_id")
            .where("players.user_id", "=", userId);
    }

    return await query.executeTakeFirst();
};
