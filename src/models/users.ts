import { Generated } from "kysely";
import db from ".";

export interface UsersTable {
    id: Generated<number>;
    username: string;
    password_hash: string;
    user_level: number;
}

export interface User extends Omit<UsersTable, "id"> {
    id: number;
}

export const nonsensitiveUserColumns: ReadonlyArray<keyof UsersTable> = [
    "id",
    "username",
    "user_level",
];

export const findUserById = async (id: number) =>
    await db
        .selectFrom("users")
        .select(nonsensitiveUserColumns)
        .where("id", "=", id)
        .executeTakeFirst();
