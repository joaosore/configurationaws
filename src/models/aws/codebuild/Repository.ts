import AWS from 'aws-sdk';
import { IRepositoryCodeBuild } from './IRepository/IRepositoryCodeBuild';
import {
  CodeBuildConstructor,
  CreateCodeBuildDTO,
  DestroyCodeBuildDTO,
} from './dtos';
import { deleteFile, fileExists, saveJSON } from '@hooks/file';

class CodeBuild implements IRepositoryCodeBuild {
  private aws;

  constructor({
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
  }: CodeBuildConstructor) {
    this.aws = new AWS.CodeBuild({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    });
  }

  async create({ params, module }: CreateCodeBuildDTO): Promise<void> {
    if (!fileExists(module, `codebuild-${module}.json`)) {
      try {
        const data = await this.aws.createProject(params).promise();
        saveJSON(module, `codebuild-${module}.json`, data, 'createProject');
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('\x1b[32m%s\x1b[0m', `OK -> CodeBuild ${params.name}`);
    }
  }

  async destory({ params, module }: DestroyCodeBuildDTO): Promise<void> {
    if (fileExists(module, `codebuild-${module}.json`)) {
      try {
        await this.aws.deleteProject(params).promise();
        deleteFile(module, `codebuild-${module}.json`, 'deleteProject');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export default CodeBuild;
