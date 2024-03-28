import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("games")
        .addColumn("id", "integer", (col) => col.primaryKey())
        .addColumn("date", "date", (col) => col.notNull())
        .addColumn("user_id", "integer", (col) =>
            col.references("users.id").onDelete("cascade").notNull()
        )
        .addColumn("notes", "varchar(255)")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("games").execute();
}
