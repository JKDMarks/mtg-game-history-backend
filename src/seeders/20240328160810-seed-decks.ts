import { Kysely } from "kysely";

import { Database } from "../models";

const seedDecks = async (db: Kysely<Database>) => {
    await db
        .insertInto("decks")
        .values([
            { id: 1, user_id: 1, name: "5C Omnath Landfall", player_id: 1 },
            { id: 2, user_id: 1, name: "Muldrotha Big Bois", player_id: 1 },
            { id: 3, user_id: 1, name: "Gisela Tryhard Aggro", player_id: 2 },
            { id: 4, user_id: 1, name: "Yidris Delibird", player_id: 2 },
            { id: 5, user_id: 1, name: "Mayael", player_id: 1 },
            { id: 6, user_id: 1, name: "Meren", player_id: 4 },
            { id: 7, user_id: 1, name: "Neera", player_id: 4 },
            { id: 8, user_id: 1, name: "Willowdusk", player_id: 5 },
            { id: 9, user_id: 1, name: "Zevlor", player_id: 5 },
            { id: 10, user_id: 1, name: "Slimefoot and Squee", player_id: 6 },
            { id: 11, user_id: 1, name: "Alesha", player_id: 6 },
        ])
        .execute();

    console.log("Decks seeded successfully");
};

export default seedDecks;
