import { createKysely } from "@vercel/postgres-kysely";
import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";

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
    }),
});

const db =
    process.env.NODE_ENV === "production"
        ? createKysely<Database>({
              connectionString: process.env.DATABASE_URL,
          })
        : new Kysely<Database>({
              dialect,
          });

export default db;
