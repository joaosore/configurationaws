import AWS from 'aws-sdk';
import { IRepositoryELB } from './IRepository/IRepositoryCodeBuild';
import {
  CreateListenerDTO,
  CreateTargetGroupDTO,
  DestroyListenerDTO,
  DestroyTargetGroupDTO,
  ELBConstructor,
} from './dtos';
import { deleteFile, fileExists, saveJSON } from '@hooks/file';

import dotenv from 'dotenv';

dotenv.config();
const { AWS_DEFAULT_REGION } = process.env;

class ELB implements IRepositoryELB {
  private aws;

  constructor({
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
  }: ELBConstructor) {
    this.aws = new AWS.ELBv2({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    });
  }

  async createListener({ params, module }: CreateListenerDTO): Promise<void> {
    if (
      !fileExists(
        module,
        `lb-target-group-${module}-${AWS_DEFAULT_REGION}.json`,
      )
    ) {
      try {
        const data = await this.aws.createListener(params).promise();
        saveJSON(
          module,
          `lb-target-group-${module}-${AWS_DEFAULT_REGION}.json`,
          data,
          'createListener',
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
  async destoryListener({ params, module }: DestroyListenerDTO): Promise<void> {
    let file = `lb-target-group-${module}-${AWS_DEFAULT_REGION}.json`;
    if (fileExists(module, file)) {
      try {
        await this.aws.deleteListener(params).promise();
        deleteFile(module, file, 'deleteListener');
      } catch (err) {
        console.error(err);
      }
    }
  }
  async createTargetGroup({
    params,
    module,
  }: CreateTargetGroupDTO): Promise<void> {
    if (!fileExists(module, `${params.Name}.json`)) {
      try {
        const data = await this.aws.createTargetGroup(params).promise();
        saveJSON(module, `${params.Name}.json`, data, 'createTargetGroup');
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('\x1b[32m%s\x1b[0m', `OK -> TargetGroup ${params.Name}`);
    }
  }
  async destoryTargetGroup({
    params,
    module,
  }: DestroyTargetGroupDTO): Promise<void> {
    let file = `${params.TargetGroupName}.json`;

    delete params.TargetGroupName;

    if (fileExists(module, file)) {
      try {
        await this.aws.deleteTargetGroup(params).promise();
        deleteFile(module, file, 'deleteRole');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export default ELB;
