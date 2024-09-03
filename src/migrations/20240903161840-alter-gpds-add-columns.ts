import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable("game_player_decks")
        .addColumn("mulligan_count", "integer", (col) => col.defaultTo(0))
        .addColumn("first_player", "boolean", (col) => col.defaultTo(false))
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable("game_player_decks")
        .dropColumn("mulligan_count")
        .dropColumn("first_player")
        .execute();
}
