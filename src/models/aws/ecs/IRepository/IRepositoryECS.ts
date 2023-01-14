import {
  CreateClusterDTO,
  CreateServiceDTO,
  CreateTaskDefinitionDTO,
  DestroyClusterDTO,
  DestroyServiceDTO,
  DestroyTaskDefinitionDTO,
  ListTaskDefinitionDTO,
} from '../dtos';

interface IRepositoryECS {
  registerTaskDefinition({
    params,
    module,
  }: CreateTaskDefinitionDTO): Promise<void>;
  deregisterTaskDefinition({
    params,
    module,
  }: DestroyTaskDefinitionDTO): Promise<void>;
  createService({ params, module }: CreateServiceDTO): Promise<void>;
  destoryService({ params, module }: DestroyServiceDTO): Promise<void>;
  listTaskDefinition({ params }: ListTaskDefinitionDTO): Promise<void>;
  createCluster({ params, module }: CreateClusterDTO): Promise<void>;
  destoryCluster({ params, module }: DestroyClusterDTO): Promise<void>;
}

export { IRepositoryECS };
