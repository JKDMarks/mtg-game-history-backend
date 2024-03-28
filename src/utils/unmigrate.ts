import * as path from "path";
import { promises as fs } from "fs";
import {
    Kysely,
    Migrator,
    FileMigrationProvider,
    MigrationResult,
} from "kysely";
import { Database, dialect } from "../models";

async function migrateDown() {
    const db = new Kysely<Database>({
        dialect,
    });

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, "../migrations"),
        }),
    });

    // const migrations = await migrator.getMigrations();
    // const migration1 = await migrator.migrateTo(migrations[0].name);
    let results: (MigrationResult | null)[] = [null];
    while (results && results.length > 0) {
        const nextMigration = await migrator.migrateDown();
        if (nextMigration.results != undefined) {
            results = nextMigration.results;
            console.log(results);
        } else {
            console.log(nextMigration.error);
            results = [];
        }
    }

    // console.log(migration1);
    // console.log(migration);

    // [...migration1.results, ...migration2.results]?.forEach((it) => {
    //     if (it.status === "Success") {
    //         console.log(
    //             `migration "${it.migrationName}" was executed successfully`
    //         );
    //     } else if (it.status === "Error") {
    //         console.error(`failed to execute migration "${it.migrationName}"`);
    //     }
    // });

    // if (migration1.error || migration2.error) {
    //     console.error("failed to migrate");
    //     console.error(migration1.error);
    //     console.error(migration2.error);
    //     process.exit(1);
    // }

    await db.destroy();
}

migrateDown();
