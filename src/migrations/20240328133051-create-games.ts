import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("games")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("date", "date", (col) => col.notNull())
        .addColumn("user_id", "integer", (col) =>
            col.references("users.id").onDelete("cascade").notNull()
        )
        .addColumn("notes", "varchar(255)")
        .execute();

    await db.schema
        .createIndex("games_user_id_index")
        .on("games")
        .column("user_id")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("games").execute();
}
