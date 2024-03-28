import { Generated } from "kysely";

export interface PlayersTable {
    id: Generated<number>;
    user_id: number;
    name: string;
}
