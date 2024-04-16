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
const seedDecks = (db) => __awaiter(void 0, void 0, void 0, function* () {
    yield db
        .insertInto("decks")
        .values([
        { id: 1, user_id: 1, name: "5C Omnath Landfall", player_id: 1 },
        { id: 2, user_id: 1, name: "Muldrotha Big Bois", player_id: 1 },
        { id: 3, user_id: 1, name: "Gisela Tryhard Aggro", player_id: 2 },
        { id: 4, user_id: 1, name: "Yidris Delibird", player_id: 2 },
        { id: 5, user_id: 1, name: "Mayael", player_id: 1 },
        { id: 6, user_id: 1, name: "Meren", player_id: 4 },
        { id: 7, user_id: 1, name: "Neera", player_id: 4 },
        { id: 8, user_id: 1, name: "Willowdusk", player_id: 5 },
        { id: 9, user_id: 1, name: "Zevlor", player_id: 5 },
        { id: 10, user_id: 1, name: "Slimefoot and Squee", player_id: 6 },
        { id: 11, user_id: 1, name: "Alesha", player_id: 6 },
    ])
        .execute();
    console.log("Decks seeded successfully");
});
exports.default = seedDecks;
