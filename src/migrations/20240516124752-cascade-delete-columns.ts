import { Kysely } from "kysely";
import { Database } from "../models";

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .alterTable("games")
        .addForeignKeyConstraint("games_user_id", ["user_id"], "users", ["id"])
        .onDelete("cascade")
        .execute();

    await db.schema
        .alterTable("players")
        .addForeignKeyConstraint("players_user_id", ["user_id"], "users", [
            "id",
        ])
        .onDelete("cascade")
        .execute();

    await db.schema
        .alterTable("decks")
        .addForeignKeyConstraint("decks_user_id", ["user_id"], "users", ["id"])
        .onDelete("cascade")
        .execute();

    await db.schema
        .alterTable("game_player_decks")
        .addForeignKeyConstraint(
            "game_player_decks_game_id",
            ["game_id"],
            "games",
            ["id"]
        )
        .onDelete("cascade")
        .execute();

    await db.schema
        .alterTable("cards")
        .addForeignKeyConstraint(
            "cards_game_player_deck_id",
            ["game_player_deck_id"],
            "game_player_decks",
            ["id"]
        )
        .onDelete("cascade")
        .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema
        .alterTable("games")
        .dropConstraint("games_user_id")
        .execute();
    await db.schema
        .alterTable("players")
        .dropConstraint("players_user_id")
        .execute();
    await db.schema
        .alterTable("decks")
        .dropConstraint("decks_user_id")
        .execute();
    await db.schema
        .alterTable("game_player_decks")
        .dropConstraint("game_player_decks_game_id")
        .execute();
    await db.schema
        .alterTable("cards")
        .dropConstraint("cards_game_player_deck_id")
        .execute();
}
