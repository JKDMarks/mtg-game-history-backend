"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    development: {
        username: "root",
        password: "password",
        database: "mysql",
        host: "127.0.0.1",
        dialect: "mysql",
    },
    // test: {
    //     username: "root",
    //     password: null,
    //     database: "database_test",
    //     host: "127.0.0.1",
    //     dialect: "mysql",
    // },
    production: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
    },
};
