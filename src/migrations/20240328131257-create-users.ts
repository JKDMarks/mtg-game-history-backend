import { Kysely } from "kysely";
import { USER_LEVEL } from "../utils/constants";

export async function up(db: Kysely<any>): Promise<void> {
    // TODO: Add name /^[a-z ,.'-]{2,63}$/i and username /^[a-z0-9_]{1,20}$/i
    // Possibly using .addColumn.check() ?
    // https://kysely-org.github.io/kysely-apidoc/classes/ColumnDefinitionBuilder.html#check
    await db.schema
        .createTable("users")
        .addColumn("id", "integer", (col) => col.primaryKey())
        .addColumn("username", "varchar(63)", (col) => col.notNull().unique())
        .addColumn("password_hash", "varchar(127)", (col) => col.notNull())
        .addColumn("name", "varchar(63)", (col) => col.notNull().unique())
        .addColumn("user_level", "integer", (col) =>
            col.defaultTo(USER_LEVEL.REGULAR_USER)
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("users").execute();
}
