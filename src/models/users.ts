import { Generated } from "kysely";

export interface UsersTable {
    id: Generated<number>;
    username: string;
    password_hash: string;
    user_level: number;
}

export const nonsensitiveUserColumns: ReadonlyArray<keyof UsersTable> = [
    "id",
    "username",
    "user_level",
];
