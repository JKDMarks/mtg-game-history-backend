import { Kysely } from "kysely";
import { USER_LEVEL } from "../utils/constants";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("users")
        .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
        .addColumn("username", "varchar(63)", (col) => col.notNull().unique())
        .addColumn("password_hash", "varchar(127)", (col) => col.notNull())
        .addColumn("user_level", "integer", (col) =>
            col.defaultTo(USER_LEVEL.REGULAR_USER)
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("users").execute();
}
