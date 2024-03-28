import { Kysely } from "kysely";

import { Database } from "../models";

const seedGamePlayerDecks = async (db: Kysely<Database>) => {
    await db
        .insertInto("game_player_decks")
        .values([
            {
                game_id: 1,
                player_id: 1,
                deck_id: 1,
                is_winner: true,
            },
            {
                game_id: 1,
                player_id: 4,
                deck_id: 6,
            },
            {
                game_id: 1,
                player_id: 5,
                deck_id: 8,
            },
            {
                game_id: 1,
                player_id: 6,
                deck_id: 10,
            },
            {
                game_id: 2,
                player_id: 1,
                deck_id: 2,
            },
            {
                game_id: 2,
                player_id: 4,
                deck_id: 6,
            },
            {
                game_id: 2,
                player_id: 5,
                deck_id: 9,
                is_winner: true,
            },
            {
                game_id: 2,
                player_id: 6,
                deck_id: 11,
            },
        ])
        .execute();
};

export default seedGamePlayerDecks;
