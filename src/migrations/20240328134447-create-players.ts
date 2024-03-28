import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    // await db.schema.createTable("players").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    // await db.schema.dropTable("players").execute();
}
