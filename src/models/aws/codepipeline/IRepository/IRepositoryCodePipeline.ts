import { CreateCodePipelineDTO, DestroyCodePipelineDTO } from '../dtos';

interface IRepositoryCodePipeline {
  create({ params, module }: CreateCodePipelineDTO): Promise<void>;
  destory({ params, module }: DestroyCodePipelineDTO): Promise<void>;
}

export { IRepositoryCodePipeline };
