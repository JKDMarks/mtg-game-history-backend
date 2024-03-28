import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("decks")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("player_id", "integer", (col) =>
            col.references("players.id").onDelete("cascade").notNull()
        )
        .addColumn("name", "varchar(63)", (col) => col.notNull())
        .execute();

    await db.schema
        .createIndex("decks_player_id_index")
        .on("decks")
        .column("player_id")
        .execute();

    await db.schema
        .createIndex("decks_player_id_name_index")
        .on("decks")
        .columns(["player_id", "name"])
        .unique()
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("decks").execute();
}
