import { Generated } from "kysely";

export interface CardsTable {
    id: Generated<number>;
    game_player_deck_id: number;
    name: string;
    turn_played: number | null;
}
