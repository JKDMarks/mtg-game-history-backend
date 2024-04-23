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

export const findUserById = async (
    id: number,
    includePassword: boolean = false
) => {
    if (includePassword) {
        return db
            .selectFrom("users")
            .selectAll("users")
            .where("id", "=", id)
            .executeTakeFirst();
    } else {
        return db
            .selectFrom("users")
            .select(nonsensitiveUserColumns)
            .where("id", "=", id)
            .executeTakeFirst();
    }
};

export const findUserByUsername = async (username: string) =>
    await db
        .selectFrom("users")
        .selectAll("users")
        .where("username", "=", username)
        .executeTakeFirst();

export const createUser = async ({
    username,
    password_hash,
    user_level,
}: {
    username: string;
    password_hash: string;
    user_level: number;
}) => {
    return await db
        .insertInto("users")
        .values({ username, password_hash, user_level })
        .executeTakeFirst();
};

export const updateUser = async ({
    userId,
    username,
    passwordHash,
    userLevel,
}: {
    userId: number;
    username?: string;
    passwordHash?: string;
    userLevel?: number;
}) => {
    let query = db.updateTable("users").where("id", "=", userId);

    if (username) {
        query = query.set({ username });
    }

    if (passwordHash) {
        query = query.set({ password_hash: passwordHash });
    }

    if (userLevel) {
        query = query.set({ user_level: userLevel });
    }

    return await query.executeTakeFirst();
};
