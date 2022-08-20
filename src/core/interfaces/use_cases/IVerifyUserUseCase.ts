
export interface IVerifyUserUseCase {
    execute(email: string, code: string): Promise<boolean>;
}
