import { IConfigManager, IListUserUseCase, IUserRepository } from '@core/interfaces';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListUserUseCase implements IListUserUseCase {
    constructor(
        @inject('IUserRepository') private userRepo: IUserRepository,
        @inject('IConfigManager') private cacheManager: IConfigManager
    ) {}

    execute = async () => {
        return await this.userRepo.findAll();
    };
}
