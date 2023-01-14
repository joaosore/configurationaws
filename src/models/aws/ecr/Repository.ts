import AWS from 'aws-sdk';
import { IRepositoryRepository } from './IRepository/IRepositoryRepository';
import {
  CreateRepositoryDTO,
  DestroyRepositoryDTO,
  ECRConstructor,
} from './dtos';

import dotenv from 'dotenv';
import { deleteFile, fileExists, saveJSON } from '@hooks/file';
dotenv.config();

const { AWS_DEFAULT_REGION, ID_ACCOUNT } = process.env;

class Repository implements IRepositoryRepository {
  private aws;

  constructor({
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
  }: ECRConstructor) {
    this.aws = new AWS.ECR({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    });
  }
  async create({ params, module }: CreateRepositoryDTO): Promise<void> {
    if (
      !fileExists(
        module,
        `${ID_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com-${module}.json`,
      )
    ) {
      try {
        const data = await this.aws.createRepository(params).promise();
        saveJSON(
          module,
          `${ID_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com-${module}.json`,
          data,
          'createRepository',
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(
        '\x1b[32m%s\x1b[0m',
        `OK -> Repository ${params.repositoryName}`,
      );
    }
  }
  async destory({ params, module }: DestroyRepositoryDTO): Promise<void> {
    let file = `${ID_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com-${module}.json`;
    if (fileExists(module, file)) {
      try {
        await this.aws.deleteRepository(params).promise();
        deleteFile(module, file, 'deleteRole');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export default Repository;
