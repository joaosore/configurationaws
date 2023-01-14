import { CreateS3DTO, DestroyS3DTO } from '../dtos';

interface IRepositoryS3 {
  create({ params, env }: CreateS3DTO): Promise<void>;
  destory({ params, env }: DestroyS3DTO): Promise<void>;
}

export { IRepositoryS3 };
