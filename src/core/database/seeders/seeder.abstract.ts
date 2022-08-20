
export abstract class Seeder {
    abstract run(): Promise<void>;
    abstract rollback(): Promise<void>;
}

export interface IDBSeeder {
    run(): Promise<void>;
    rollback(): Promise<void>;
}
