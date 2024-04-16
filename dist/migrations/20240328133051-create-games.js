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
function up(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema
            .createTable("games")
            .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
            .addColumn("date", "date", (col) => col.notNull())
            .addColumn("user_id", "integer", (col) => col.references("users.id").onDelete("cascade").notNull())
            .addColumn("notes", "varchar(1023)")
            .execute();
        yield db.schema
            .createIndex("games_user_id_index")
            .on("games")
            .column("user_id")
            .execute();
    });
}
exports.up = up;
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("games").execute();
    });
}
exports.down = down;
