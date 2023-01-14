import { CreateBuildSpecDTO, DestroyBuildSpecDTO } from './../dtos';

interface IRepositoryBuildSpec {
  create({ region, ecr, module }: CreateBuildSpecDTO): Promise<void>;
  destory({ module }: DestroyBuildSpecDTO): Promise<void>;
}

export { IRepositoryBuildSpec };
