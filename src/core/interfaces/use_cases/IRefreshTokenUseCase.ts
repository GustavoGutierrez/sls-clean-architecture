export interface IRefreshTokenUseCase {
    execute(refreshToken: string): Promise<Partial<any> | boolean>;
}
