import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import "dotenv/config";

import config from "../config/config";
import { UsersTable } from "./users";
import { GamesTable } from "./games";
import { PlayersTable } from "./players";
import { DecksTable } from "./decks";
import { GamePlayerDecksTable } from "./game-player-decks";

export interface Database {
    users: UsersTable;
    games: GamesTable;
    players: PlayersTable;
    decks: DecksTable;
    game_player_decks: GamePlayerDecksTable;
}

export const env = process.env.NODE_ENV || "development";

export const dialect = new MysqlDialect({
    pool: createPool({
        database: config[env as keyof typeof config].database,
        host: config[env as keyof typeof config].host,
        user: config[env as keyof typeof config].username,
        password: config[env as keyof typeof config].password,
        // port: 3306,
        connectionLimit: 10,
        typeCast: function (field, next) {
            if (field.type === "DATE") {
                return field.string();
            } else {
                return next();
            }
        },
    }),
});

const db =
    // process.env.NODE_ENV === "production"
    //     ? createKysely<Database>({
    //           connectionString: process.env.DATABASE_URL,
    //       })
    //     :
    new Kysely<Database>({
        dialect,
    });

export default db;
