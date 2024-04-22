import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import "dotenv/config";

import config from "../config/config";
import { UsersTable } from "./users";
import { GamesTable } from "./games";
import { PlayersTable } from "./players";
import { DecksTable } from "./decks";
import { GamePlayerDecksTable } from "./game-player-decks";
import { CardsTable } from "./cards";

export interface Database {
    users: UsersTable;
    games: GamesTable;
    players: PlayersTable;
    decks: DecksTable;
    game_player_decks: GamePlayerDecksTable;
    cards: CardsTable;
}

export const env = process.env.NODE_ENV || "development";

export const dialect = new MysqlDialect({
    pool: createPool({
        database: config[env as keyof typeof config].database,
        host: config[env as keyof typeof config].host,
        user: config[env as keyof typeof config].username,
        password: config[env as keyof typeof config].password,
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

const db = new Kysely<Database>({
    dialect,
});

export default db;
