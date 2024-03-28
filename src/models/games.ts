import { Generated } from "kysely";

export interface GamesTable {
    id: Generated<number>;
    date: string;
    user_id: number;
    notes: string | null;
}
