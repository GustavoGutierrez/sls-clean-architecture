import { IDBHelper } from '@core/interfaces';
import { User } from '@core/types/User';
import { genSalt, hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { Seeder } from './seeder.abstract';

const userTableName: string = process.env.USER_TABLE || 'user';

@injectable()
export class UserSeeder extends Seeder {
    constructor(@inject('IDBHelper') private dbHelper: IDBHelper) {
        super();
    }

    async run(): Promise<void> {
        const salt = await genSalt(10);
        const passwordHash = await hash('6o&rZR8IL4#8', salt);

        const adminUser: User = {
            email: 'gustavogutierrezmercado@gmail.com',
            password: passwordHash,
            fullname: 'Gustavo Gutierrez',
            phone: '+56988888888',
            avatar: 'https://ui-avatars.com/api/?background=174AAD&color=fff&size=150&name=Gustavo',
            verified: true,
            verification_code: '',
            active: true,
            realm: 'admin',
            created: new Date().toISOString()
        };

        await this.dbHelper.put(userTableName, adminUser);
    }

    async rollback(): Promise<void> {
        await this.dbHelper.delete(userTableName, { email: 'gustavogutierrezmercado@gmail.com' });
    }
}
