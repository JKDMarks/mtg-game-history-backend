import db from "../models";
import seedUsers from "../seeders/20240328151659-seed-users";
import seedPlayers from "../seeders/20240328154113-seed-players";
import seedDecks from "../seeders/20240328160810-seed-decks";
import seedGames from "../seeders/20240328160912-seed-games";
import seedGamePlayerDecks from "../seeders/20240328161042-seed-game-player-decks";

// npx ts-node ./src/scripts/seed.ts

const seedAll = async () => {
    await seedUsers(db);
    await seedPlayers(db);
    await seedDecks(db);
    await seedGames(db);
    await seedGamePlayerDecks(db);

    await db.destroy();
};

seedAll();
