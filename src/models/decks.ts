import { Generated } from "kysely";

export interface DecksTable {
    id: Generated<number>;
    player_id: number;
    name: string;
}
