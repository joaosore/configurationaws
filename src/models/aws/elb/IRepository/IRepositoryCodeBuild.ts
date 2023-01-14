import {
  CreateListenerDTO,
  CreateTargetGroupDTO,
  DestroyListenerDTO,
  DestroyTargetGroupDTO,
} from '../dtos';

interface IRepositoryELB {
  createTargetGroup({ params, module }: CreateTargetGroupDTO): Promise<void>;
  destoryTargetGroup({ params, module }: DestroyTargetGroupDTO): Promise<void>;
  createListener({ params, module }: CreateListenerDTO): Promise<void>;
  destoryListener({ params, module }: DestroyListenerDTO): Promise<void>;
}

export { IRepositoryELB };
