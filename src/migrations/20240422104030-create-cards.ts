import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("cards")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("game_player_deck_id", "integer", (col) =>
            col.references("game_player_decks.id").onDelete("cascade").notNull()
        )
        .addColumn("name", "varchar(127)", (col) => col.notNull())
        .addColumn("turn_played", "integer")
        .execute();

    await db.schema
        .createIndex("cards_game_player_deck_id_index")
        .on("cards")
        .column("game_player_deck_id")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("cards").execute();
}
