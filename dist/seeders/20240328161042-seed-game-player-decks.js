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
const seedGamePlayerDecks = (db) => __awaiter(void 0, void 0, void 0, function* () {
    yield db
        .insertInto("game_player_decks")
        .values([
        {
            game_id: 1,
            player_id: 1,
            deck_id: 1,
            is_winner: true,
        },
        {
            game_id: 1,
            player_id: 4,
            deck_id: 6,
        },
        {
            game_id: 1,
            player_id: 5,
            deck_id: 8,
        },
        {
            game_id: 1,
            player_id: 6,
            deck_id: 10,
        },
        {
            game_id: 2,
            player_id: 1,
            deck_id: 2,
        },
        {
            game_id: 2,
            player_id: 4,
            deck_id: 6,
        },
        {
            game_id: 2,
            player_id: 5,
            deck_id: 9,
            is_winner: true,
        },
        {
            game_id: 2,
            player_id: 6,
            deck_id: 11,
        },
    ])
        .execute();
    console.log("GPDs seeded successfully");
});
exports.default = seedGamePlayerDecks;
