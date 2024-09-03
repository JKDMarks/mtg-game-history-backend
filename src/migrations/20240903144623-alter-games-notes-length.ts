import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable("games").modifyColumn("notes", "text").execute();
}

export async function down(): Promise<void> {
    // await db.schema.dropTable("cards").execute();
}
