import { Kysely } from "kysely";

import { Database } from "../models";

const seedPlayers = async (db: Kysely<Database>) => {
    await db
        .insertInto("players")
        .values([
            { id: 1, user_id: 1, name: "Jeff Marks", is_archived: false },
            { id: 2, user_id: 1, name: "Peter Paranicas", is_archived: false },
            { id: 3, user_id: 1, name: "Ryan Burgett", is_archived: false },
            { id: 4, user_id: 1, name: "Jonah Warner", is_archived: false },
            { id: 5, user_id: 1, name: "Cole Anderson", is_archived: false },
            { id: 6, user_id: 1, name: "Dan Shapiro", is_archived: false },
        ])
        .execute();

    console.log("Players seeded successfully");
};

export default seedPlayers;
