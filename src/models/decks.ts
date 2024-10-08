import { ExpressionBuilder, Generated } from "kysely";
import db, { Database } from ".";
import { jsonObjectFrom } from "kysely/helpers/mysql";

export interface DecksTable {
    id: Generated<number>;
    user_id: number;
    player_id: number;
    name: string;
}

const withPlayer = (eb: ExpressionBuilder<Database, "decks">) => {
    return jsonObjectFrom(
        eb
            .selectFrom("players")
            .select(["id", "name"])
            .whereRef("decks.player_id", "=", "players.id")
    ).as("player");
};

export const findOneDeck = async ({
    deckId,
    userId,
}: {
    deckId: number;
    userId?: number;
}) => {
    let query = db
        .selectFrom("decks")
        .select(["id", "user_id", "name"])
        .select(withPlayer)
        .where("decks.id", "=", deckId);

    if (userId) {
        query = query.where("decks.user_id", "=", userId);
    }

    return await query.executeTakeFirst();
};

export const findAllDecks = async (currUserId?: number) => {
    let query = db
        .selectFrom("decks")
        .select(["id", "user_id", "name"])
        .select(withPlayer)
        .orderBy("id");

    if (currUserId) {
        query = query.where("user_id", "=", currUserId);
    }

    return await query.execute();
};

export const createDeck = (
    name: string,
    player_id: number,
    user_id: number
) => {
    return db
        .insertInto("decks")
        .values({ name, player_id, user_id })
        .executeTakeFirst();
};

export const selectDeckCount = async (currUserId: number) => {
    return await db
        .selectFrom("decks")
        .select(({ eb }: { eb: ExpressionBuilder<Database, "decks"> }) =>
            eb.fn.count("decks.id").as("deck_count")
        )
        .where("user_id", "=", currUserId)
        .executeTakeFirst();
};

export const updateDeck = async ({
    deckId,
    name,
}: {
    deckId: number;
    name?: string;
}) => {
    let query = db.updateTable("decks").where("id", "=", deckId);

    if (name) {
        query = query.set({ name });
    }

    return await query.executeTakeFirst();
};

export const selectDeckCards = async ({ deckId }: { deckId: number }) => {
    const cardNames = await db
        .selectFrom("decks")
        .innerJoin("game_player_decks", "game_player_decks.deck_id", "decks.id")
        .innerJoin("cards", "cards.game_player_deck_id", "game_player_decks.id")
        .select("cards.name")
        .where("decks.id", "=", deckId)
        .orderBy("cards.name")
        .distinct()
        .execute();

    return cardNames.map((obj) => obj.name);
};
