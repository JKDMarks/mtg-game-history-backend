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
            .alterTable("games")
            .addForeignKeyConstraint("games_user_id", ["user_id"], "users", ["id"])
            .onDelete("cascade")
            .execute();
        yield db.schema
            .alterTable("players")
            .addForeignKeyConstraint("players_user_id", ["user_id"], "users", [
            "id",
        ])
            .onDelete("cascade")
            .execute();
        yield db.schema
            .alterTable("decks")
            .addForeignKeyConstraint("decks_user_id", ["user_id"], "users", ["id"])
            .onDelete("cascade")
            .execute();
        yield db.schema
            .alterTable("game_player_decks")
            .addForeignKeyConstraint("game_player_decks_game_id", ["game_id"], "games", ["id"])
            .onDelete("cascade")
            .execute();
        yield db.schema
            .alterTable("cards")
            .addForeignKeyConstraint("cards_game_player_deck_id", ["game_player_deck_id"], "game_player_decks", ["id"])
            .onDelete("cascade")
            .execute();
    });
}
exports.up = up;
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema
            .alterTable("games")
            .dropConstraint("games_user_id")
            .execute();
        yield db.schema
            .alterTable("players")
            .dropConstraint("players_user_id")
            .execute();
        yield db.schema
            .alterTable("decks")
            .dropConstraint("decks_user_id")
            .execute();
        yield db.schema
            .alterTable("game_player_decks")
            .dropConstraint("game_player_decks_game_id")
            .execute();
        yield db.schema
            .alterTable("cards")
            .dropConstraint("cards_game_player_deck_id")
            .execute();
    });
}
exports.down = down;
