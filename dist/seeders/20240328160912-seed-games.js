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
const seedGames = (db) => __awaiter(void 0, void 0, void 0, function* () {
    yield db
        .insertInto("games")
        .values([
        {
            id: 1,
            date: "2023-09-06",
            user_id: 1,
        },
        {
            id: 2,
            date: "2023-09-06",
            user_id: 1,
        },
        // {
        //     date: "2023-09-07",
        //     user_id: jeff.id,
        // },
        // {
        //     date: "2024-01-15",
        //     user_id: peter.id,
        // },
        // {
        //     date: "2024-03-15",
        //     user_id: peter.id,
        // },
        // {
        //     date: "2024-03-16",
        //     user_id: peter.id,
        // },
    ])
        .execute();
    console.log("Games seeded successfully");
});
exports.default = seedGames;
