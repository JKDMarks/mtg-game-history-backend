import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("game_player_decks")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("is_winner", "boolean", (col) => col.defaultTo(false))
        .addColumn("game_id", "integer", (col) =>
            col.references("games.id").onDelete("cascade").notNull()
        )
        .addColumn("player_id", "integer", (col) =>
            col.references("players.id").onDelete("cascade").notNull()
        )
        .addColumn("deck_id", "integer", (col) =>
            col.references("decks.id").onDelete("cascade").notNull()
        )
        .execute();

    await db.schema
        .createIndex("gpds_player_id_index")
        .on("game_player_decks")
        .column("player_id")
        .execute();

    await db.schema
        .createIndex("gpds_deck_id_index")
        .on("game_player_decks")
        .column("deck_id")
        .execute();

    await db.schema
        .createIndex("gpds_game_player_index")
        .on("game_player_decks")
        .columns(["game_id", "player_id"])
        .unique()
        .execute();

    await db.schema
        .createIndex("gpds_game_deck_index")
        .on("game_player_decks")
        .columns(["game_id", "deck_id"])
        .unique()
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("game_player_decks").execute();
}
