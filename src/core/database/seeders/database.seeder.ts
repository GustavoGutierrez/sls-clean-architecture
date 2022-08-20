import { inject, injectable } from 'tsyringe';
import { IDBSeeder, Seeder } from './seeder.abstract';

@injectable()
export class DatabaseSeeder implements IDBSeeder {

    constructor(@inject('UserSeeder') private userSeeder: Seeder) { }
    /**
     * Seed the database.
     */
    async run(): Promise<void> {
        // Seed the database. implement carga masiva
        // aws dynamodb batch-write-item --request-items file://ProductCatalog.json
        await this.userSeeder.run();
    }

    async rollback(): Promise<void> {
        await this.userSeeder.rollback();
    }
}
