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
            .createTable("game_player_decks")
            .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
            .addColumn("is_winner", "boolean", (col) => col.defaultTo(false))
            .addColumn("game_id", "integer", (col) => col.references("games.id").onDelete("cascade").notNull())
            .addColumn("player_id", "integer", (col) => col.references("players.id").onDelete("cascade").notNull())
            .addColumn("deck_id", "integer", (col) => col.references("decks.id").onDelete("cascade").notNull())
            .execute();
        yield db.schema
            .createIndex("gpds_player_id_index")
            .on("game_player_decks")
            .column("player_id")
            .execute();
        yield db.schema
            .createIndex("gpds_deck_id_index")
            .on("game_player_decks")
            .column("deck_id")
            .execute();
        yield db.schema
            .createIndex("gpds_game_player_index")
            .on("game_player_decks")
            .columns(["game_id", "player_id"])
            .unique()
            .execute();
        yield db.schema
            .createIndex("gpds_game_deck_index")
            .on("game_player_decks")
            .columns(["game_id", "deck_id"])
            .unique()
            .execute();
    });
}
exports.up = up;
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("game_player_decks").execute();
    });
}
exports.down = down;
