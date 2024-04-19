import { Kysely } from "kysely";
import { Database } from "../models";

const seedGames = async (db: Kysely<Database>) => {
    await db
        .insertInto("games")
        .values([
            {
                id: 1,
                date: "2023-09-06",
                user_id: 1,
            },
            {
                id: 2,
                date: "2023-09-06",
                user_id: 1,
            },
        ])
        .execute();

    console.log("Games seeded successfully");
};

export default seedGames;
