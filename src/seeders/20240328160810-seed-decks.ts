import { Kysely } from "kysely";

import { Database } from "../models";

const seedDecks = async (db: Kysely<Database>) => {
    await db
        .insertInto("decks")
        .values([
            { id: 1, name: "5C Omnath Landfall", player_id: 1 },
            { id: 2, name: "Muldrotha Big Bois", player_id: 1 },
            { id: 3, name: "Gisela Tryhard Aggro", player_id: 2 },
            { id: 4, name: "Yidris Delibird", player_id: 2 },
            { id: 5, name: "Mayael", player_id: 1 },
            { id: 6, name: "Meren", player_id: 4 },
            { id: 7, name: "Neera", player_id: 4 },
            { id: 8, name: "Willowdusk", player_id: 5 },
            { id: 9, name: "Zevlor", player_id: 5 },
            { id: 10, name: "Slimefoot and Squee", player_id: 6 },
            { id: 11, name: "Alesha", player_id: 6 },
        ])
        .execute();
};

export default seedDecks;
