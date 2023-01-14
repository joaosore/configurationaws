import {
  AttachPolicyDTO,
  CreatePolicyDTO,
  CreateRoleDTO,
  DestroyPolicyDTO,
  DestroyRoleDTO,
  DetachPolicyDTO,
} from '../dtos';

interface IRepositoryIAM {
  createRole({ params, module }: CreateRoleDTO): Promise<void>;
  destoryRole({ params, module }: DestroyRoleDTO): Promise<void>;
  createPolicy({ params, module }: CreatePolicyDTO): Promise<void>;
  destoryPolicy({ params, module }: DestroyPolicyDTO): Promise<void>;
  attachPolicy({ params }: AttachPolicyDTO): Promise<void>;
  detachPolicy({ params }: DetachPolicyDTO): Promise<void>;
}

export { IRepositoryIAM };
