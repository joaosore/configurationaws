import { CreateGitlabCiDTO, DestroyGitlabCiDTO } from '../dtos';

interface IRepositoryGitlabCi {
  create({ s3, module }: CreateGitlabCiDTO): Promise<void>;
  destory({ module }: DestroyGitlabCiDTO): Promise<void>;
}

export { IRepositoryGitlabCi };
