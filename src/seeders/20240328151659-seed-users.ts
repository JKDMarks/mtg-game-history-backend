import bcrypt from "bcryptjs";

import db from "../models";
import { USER_LEVEL } from "../utils/constants";

const seedUsers = async () => {
    await db
        .insertInto("users")
        .values([
            {
                username: "jeff",
                passwordHash: bcrypt.hashSync("password1"),
                userLevel: USER_LEVEL.ADMIN,
            },
            {
                username: "peter",
                passwordHash: bcrypt.hashSync("password2"),
                userLevel: USER_LEVEL.REGULAR_USER,
            },
            {
                username: "ryan",
                passwordHash: bcrypt.hashSync("password4"),
                userLevel: USER_LEVEL.RESTRICTED,
            },
            {
                username: "jonah",
                passwordHash: bcrypt.hashSync("password4"),
                userLevel: USER_LEVEL.BANNED,
            },
        ])
        .execute();
};

export default seedUsers;
