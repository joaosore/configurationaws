import { CreateRepositoryDTO, DestroyRepositoryDTO } from '../dtos';

interface IRepositoryRepository {
  create({ params, module }: CreateRepositoryDTO): Promise<void>;
  destory({ params, module }: DestroyRepositoryDTO): Promise<void>;
}

export { IRepositoryRepository };
