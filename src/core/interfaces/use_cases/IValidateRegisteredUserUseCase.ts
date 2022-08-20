
export interface IValidateRegisteredUserUseCase {
    execute(email: string): Promise<boolean>;
}
