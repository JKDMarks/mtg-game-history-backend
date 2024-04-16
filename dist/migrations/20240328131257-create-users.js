"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const constants_1 = require("../utils/constants");
function up(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema
            .createTable("users")
            .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
            .addColumn("username", "varchar(63)", (col) => col.notNull().unique())
            .addColumn("password_hash", "varchar(127)", (col) => col.notNull())
            .addColumn("user_level", "integer", (col) => col.defaultTo(constants_1.USER_LEVEL.REGULAR_USER))
            .execute();
    });
}
exports.up = up;
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("users").execute();
    });
}
exports.down = down;
