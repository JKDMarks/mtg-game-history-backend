import * as path from "path";
import { promises as fs } from "fs";
import {
    Kysely,
    Migrator,
    FileMigrationProvider,
    MigrationResult,
} from "kysely";
import { Database, dialect } from "../models";

async function migrateDownAll() {
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

    await db.destroy();
}

migrateDownAll();
