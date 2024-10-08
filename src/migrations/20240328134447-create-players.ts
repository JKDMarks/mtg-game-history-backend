import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("players")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("user_id", "integer", (col) =>
            col.references("users.id").onDelete("cascade").notNull()
        )
        .addColumn("name", "varchar(63)", (col) => col.notNull())
        .execute();

    await db.schema
        .createIndex("players_user_id_index")
        .on("players")
        .column("user_id")
        .execute();

    await db.schema
        .createIndex("players_user_id_name_index")
        .on("players")
        .columns(["user_id", "name"])
        .unique()
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("players").execute();
}
