import AWS from 'aws-sdk';
import { deleteFile, fileExists, saveJSON } from '../../../hooks/file';

const { ACCESSKEYID, SECRETACCESSKEY, REGION } = process.env;

import AWS from 'aws-sdk';
import { IRepositoryCodePipeline } from './IRepository/IRepositoryCodePipeline';
import {
  CodePipelineConstructor,
  CreateCodePipelineDTO,
  DestroyCodePipelineDTO,
} from './dtos';

class CodePipeline implements IRepositoryCodePipeline {
  private aws;

  constructor({
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
  }: CodePipelineConstructor) {
    this.aws = new AWS.CodePipeline({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    });
  }

  async create({ params, module }: CreateCodePipelineDTO): Promise<void> {
    if (!fileExists(module, `code-pipeline-${module}.json`)) {
      try {
        const data = await this.aws.createPipeline(params).promise();
        saveJSON(
          module,
          `code-pipeline-${module}.json`,
          data,
          'createPipeline',
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(
        '\x1b[32m%s\x1b[0m',
        `OK -> Repository ${params.pipeline.name}`,
      );
    }
  }
  async destory({ params, module }: DestroyCodePipelineDTO): Promise<void> {
    try {
      await this.aws.deletePipeline(params).promise();
      let file = `code-pipeline-${module}.json`;
      if (fileExists(module, file)) {
        deleteFile(module, file, 'deletePipeline');
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default CodePipeline;
