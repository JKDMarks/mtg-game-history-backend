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
const seedPlayers = (db) => __awaiter(void 0, void 0, void 0, function* () {
    yield db
        .insertInto("players")
        .values([
        { id: 1, user_id: 1, name: "Jeff Marks" },
        { id: 2, user_id: 1, name: "Peter Paranicas" },
        { id: 3, user_id: 1, name: "Ryan Burgett" },
        { id: 4, user_id: 1, name: "Jonah Warner" },
        { id: 5, user_id: 1, name: "Cole Anderson" },
        { id: 6, user_id: 1, name: "Dan Shapiro" },
    ])
        .execute();
    console.log("Players seeded successfully");
});
exports.default = seedPlayers;
