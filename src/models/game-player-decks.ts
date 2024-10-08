import { Generated } from "kysely";

export interface GamePlayerDecksTable {
    id: Generated<number>;
    is_winner: boolean | null;
    game_id: number;
    player_id: number;
    deck_id: number;
    mulligan_count: number | null;
    first_player: boolean | null;
}
