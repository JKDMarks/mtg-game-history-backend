import { Generated } from "kysely";

export interface UsersTable {
    id: Generated<number>;
    username: string;
    passwordHash: string;
    userLevel: number;
}

export const nonsensitiveUserColumns: ReadonlyArray<keyof UsersTable> = [
    "id",
    "username",
    "userLevel",
];
