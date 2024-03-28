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
            // {
            //     date: "2023-09-07",
            //     user_id: jeff.id,
            // },
            // {
            //     date: "2024-01-15",
            //     user_id: peter.id,
            // },
            // {
            //     date: "2024-03-15",
            //     user_id: peter.id,
            // },
            // {
            //     date: "2024-03-16",
            //     user_id: peter.id,
            // },
        ])
        .execute();

    console.log("Games seeded successfully");
};

export default seedGames;
