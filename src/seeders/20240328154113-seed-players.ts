import { Kysely } from "kysely";

import { Database } from "../models";

const seedPlayers = async (db: Kysely<Database>) => {
    await db
        .insertInto("players")
        .values([
            { id: 1, user_id: 1, name: "Jeff Marks" },
            { id: 2, user_id: 1, name: "Peter Paranicas" },
            { id: 3, user_id: 1, name: "Ryan Burgett" },
            { id: 4, user_id: 1, name: "Jonah Warner" },
            { id: 5, user_id: 1, name: "Cole Anderson" },
            { id: 6, user_id: 1, name: "Dan Shapiro" },
        ])
        .execute();

    console.log("Players seeded successfully");
};

export default seedPlayers;
