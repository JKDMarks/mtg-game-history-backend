import db from "../models";
import seedUsers from "./20240328151659-seed-users";
import seedPlayers from "./20240328154113-seed-players";
import seedDecks from "./20240328160810-seed-decks";
import seedGames from "./20240328160912-seed-games";
import seedGamePlayerDecks from "./20240328161042-seed-game-player-decks";

const seedAll = async () => {
    await seedUsers(db);
    await seedPlayers(db);
    await seedDecks(db);
    await seedGames(db);
    await seedGamePlayerDecks(db);

    await db.destroy();
};

seedAll();
