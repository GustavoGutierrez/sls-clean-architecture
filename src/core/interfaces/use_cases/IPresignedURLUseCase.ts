

export interface IPresignedURLUseCase {
    execute(key: string, bucket: string, expires?:number): Promise<string>;
}


