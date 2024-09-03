import * as path from "path";
import { promises as fs } from "fs";
import {
    Kysely,
    Migrator,
    FileMigrationProvider,
    MigrationResult,
} from "kysely";
import { Database, dialect } from "../models";

// npx ts-node ./src/scripts/migrate.ts [number_of_undos]

async function migrateDown(numMigrations?: number) {
    const db = new Kysely<Database>({
        dialect,
    });

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, "../migrations"),
        }),
    });

    if (numMigrations) {
        while (numMigrations > 0) {
            const nextMigration = await migrator.migrateDown();
            console.log(nextMigration);
            numMigrations--;
        }
    } else {
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
    }

    await db.destroy();
}

const numMigrations = Number(process.argv[2]);
migrateDown(isNaN(numMigrations) ? undefined : numMigrations);
