import { CreateCodeBuildDTO, DestroyCodeBuildDTO } from '../dtos';

interface IRepositoryCodeBuild {
  create({ params, module }: CreateCodeBuildDTO): Promise<void>;
  destory({ params, module }: DestroyCodeBuildDTO): Promise<void>;
}

export { IRepositoryCodeBuild };
