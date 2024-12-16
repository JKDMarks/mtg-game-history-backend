import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable("players")
        .addColumn("is_archived", "boolean", (col) => col.defaultTo(false))
        .execute();

    await db.schema
        .alterTable("decks")
        .addColumn("is_archived", "boolean", (col) => col.defaultTo(false))
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable("players").dropColumn("is_archived").execute();
    await db.schema.alterTable("decks").dropColumn("is_archived").execute();
}
