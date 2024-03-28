import { Kysely } from "kysely";
import bcrypt from "bcryptjs";

import { USER_LEVEL } from "../utils/constants";
import { Database } from "../models";

export const JEFF_USERNAME = "jeff";
export const PETER_USERNAME = "peter";
export const RYAN_USERNAME = "ryan";
export const JONAH_USERNAME = "jonah";

const seedUsers = async (db: Kysely<Database>) => {
    await db
        .insertInto("users")
        .values([
            {
                id: 1,
                username: JEFF_USERNAME,
                password_hash: bcrypt.hashSync("password1"),
                user_level: USER_LEVEL.ADMIN,
            },
            {
                id: 2,
                username: PETER_USERNAME,
                password_hash: bcrypt.hashSync("password2"),
                user_level: USER_LEVEL.REGULAR_USER,
            },
            {
                id: 3,
                username: RYAN_USERNAME,
                password_hash: bcrypt.hashSync("password4"),
                user_level: USER_LEVEL.RESTRICTED,
            },
            {
                id: 4,
                username: JONAH_USERNAME,
                password_hash: bcrypt.hashSync("password4"),
                user_level: USER_LEVEL.BANNED,
            },
        ])
        .execute();
};

export default seedUsers;
