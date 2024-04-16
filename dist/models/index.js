"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = exports.env = void 0;
const kysely_1 = require("kysely");
const mysql2_1 = require("mysql2");
require("dotenv/config");
const config_1 = __importDefault(require("../config/config"));
exports.env = process.env.NODE_ENV || "development";
exports.dialect = new kysely_1.MysqlDialect({
    pool: (0, mysql2_1.createPool)({
        database: config_1.default[exports.env].database,
        host: config_1.default[exports.env].host,
        user: config_1.default[exports.env].username,
        password: config_1.default[exports.env].password,
        // port: 3306,
        connectionLimit: 10,
        typeCast: function (field, next) {
            if (field.type === "DATE") {
                return field.string();
            }
            else {
                return next();
            }
        },
    }),
});
const db = 
// process.env.NODE_ENV === "production"
//     ? createKysely<Database>({
//           connectionString: process.env.DATABASE_URL,
//       })
//     :
new kysely_1.Kysely({
    dialect: exports.dialect,
});
exports.default = db;
