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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const _20240328151659_seed_users_1 = __importDefault(require("../seeders/20240328151659-seed-users"));
const _20240328154113_seed_players_1 = __importDefault(require("../seeders/20240328154113-seed-players"));
const _20240328160810_seed_decks_1 = __importDefault(require("../seeders/20240328160810-seed-decks"));
const _20240328160912_seed_games_1 = __importDefault(require("../seeders/20240328160912-seed-games"));
const _20240328161042_seed_game_player_decks_1 = __importDefault(require("../seeders/20240328161042-seed-game-player-decks"));
// npx ts-node ./src/scripts/seed.ts
const seedAll = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, _20240328151659_seed_users_1.default)(models_1.default);
    yield (0, _20240328154113_seed_players_1.default)(models_1.default);
    yield (0, _20240328160810_seed_decks_1.default)(models_1.default);
    yield (0, _20240328160912_seed_games_1.default)(models_1.default);
    yield (0, _20240328161042_seed_game_player_decks_1.default)(models_1.default);
    yield models_1.default.destroy();
});
seedAll();
